const {beforeAll, afterAll, test, expect} = require("@jest/globals"),
    AWS = require("aws-sdk"),
    https = require('https'),
    util = require('util'),
    exec = util.promisify(require('child_process').exec),
    codeBuildTestData = require('../testData/codeBuildEvents'),
    codePipelineTestData = require('../testData/codePipelineEvents')

const cloudFormation = new AWS.CloudFormation()
const lambdaApi = new AWS.Lambda()

const isUsingEphemeralStack = !process.env.hasOwnProperty('STACK_NAME')
let stackName
let ccttrayXmlUrl
let codeBuildLambdaFunctionName
let codePipelineLambdaFunctionName

beforeAll(async () => {
    stackName = isUsingEphemeralStack ? generateEphemeralStackName() : process.env['STACK_NAME']

    if (isUsingEphemeralStack) {
        console.log(`Starting cloudformation deployment of stack ${stackName}`)
        const { stdout } = await exec(`./deploy.sh ${stackName}`)
        console.log('Deployment finished')
        console.log(stdout)
    }
    else {
        console.log(`Using existing stack ${stackName} as application target`)
    }

    const cloudformationStacks = await cloudFormation.describeStacks({StackName: stackName}).promise()
    ccttrayXmlUrl = cloudformationStacks
        .Stacks[0]
        .Outputs
        .find(output => output.OutputKey === 'CCTrayXMLURL')
        .OutputValue

    const stackResources = await cloudFormation.describeStackResources({StackName: stackName}).promise()

    codeBuildLambdaFunctionName = stackResources
        .StackResources
        .find(resource => resource.LogicalResourceId === 'CodeBuildEventProcessor')
        .PhysicalResourceId

    codePipelineLambdaFunctionName = stackResources
        .StackResources
        .find(resource => resource.LogicalResourceId === 'CodePipelineEventProcessor')
        .PhysicalResourceId

    console.log(`Using CCTray XML URL at [${ccttrayXmlUrl}]`)
    console.log(`Using CodeBuild event Lambda Function [${codeBuildLambdaFunctionName}]`)
    console.log(`Using CodePipeline event Lambda Function [${codePipelineLambdaFunctionName}]`)
})

function generateEphemeralStackName() {
    const prefix = process.env.hasOwnProperty('STACK_NAME_PREFIX')
        ? process.env['STACK_NAME_PREFIX']
        : `ccstar-it`
    const now = new Date(),
        year = now.getFullYear(),
        month = twoCharacter(now.getMonth() + 1),
        day = twoCharacter(now.getDate()),
        hours = twoCharacter(now.getHours()),
        minutes = twoCharacter(now.getMinutes()),
        seconds = twoCharacter(now.getSeconds())
    return `${prefix}-${year}${month}${day}-${hours}${minutes}${seconds}`
}

function twoCharacter(number) {
    return number < 10 ? `0${number}` : `${number}`
}

afterAll(async () => {
    if (isUsingEphemeralStack) {
        console.log(`Calling cloudformation to delete stack ${stackName}`)
        await cloudFormation.deleteStack({StackName: stackName}).promise()
    }
    else {
        console.log(`Leaving stack ${stackName} as deployed`)
    }
})

test('API should return 200 exit code and expected content', async () => {
    expect(ccttrayXmlUrl).toBeDefined()

    await lambdaApi.invoke({
        FunctionName: codeBuildLambdaFunctionName,
        InvocationType: 'RequestResponse',
        LogType: 'None',
        Payload: JSON.stringify(codeBuildTestData.startedEvent)
    }).promise()
    await lambdaApi.invoke({
        FunctionName: codePipelineLambdaFunctionName,
        InvocationType: 'RequestResponse',
        LogType: 'None',
        Payload: JSON.stringify(codePipelineTestData.startedEvent)
    }).promise()
    const result = await getWithBody(`${ccttrayXmlUrl}`)

    expect(result.statusCode).toBe(200)
    expect(result.body).toContain(`name="TestProject"`)
    expect(result.body).toContain(`name="TestPipeline"`)
    // TODO - could test more here
})

function getWithBody(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let body = ''
            response.on('data', (chunk) => body += chunk)
            response.on('end', () => resolve({...response, ...{body: body}}))
        }).on('error', reject)
    })}
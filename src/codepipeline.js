const AWS = require("aws-sdk"),
    codepipeline = new AWS.CodePipeline();

function generateWebUrl(pipelineName) {
    // This can take a region as a query string param, but region wasn't obvious from returned data. Maybe when we use CW Events instead.
    return `https://console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipelineName}/view`
}

function translateExecution(pipelineName, execution) {
    const isCompleted = execution.status === 'Stopped' || execution.status === 'Succeeded' || execution.status === 'Failed'

    // In theory could look at previous execution for lastBuildStatus when execution in progress
    const lastBuildStatus = execution.status === 'Succeeded'
        ? 'Success'
        : (execution.status === 'Failed' ? 'Failure' : 'Unknown')

    return {
        name: pipelineName,
        activity: isCompleted ? 'Sleeping' : 'Building',
        lastBuildStatus: lastBuildStatus,
        // TODO - this should actually be previous execution for in progress. Perhaps same bug in CodeBuild
        lastBuildLabel: execution.pipelineExecutionId,
        lastBuildTime: execution.startTime.toISOString(),
        webUrl: generateWebUrl(pipelineName)
    }
}

async function getProjectCurrentStatus(pipeline) {
    const executions = await codepipeline.listPipelineExecutions({
        pipelineName: pipeline.name
    }).promise()

    return translateExecution(pipeline.name, executions.pipelineExecutionSummaries[0])
}

async function getProjects() {
    // TODO - paging, etc.
    const allPipelines = await codepipeline.listPipelines({}).promise()
    return await Promise.all(allPipelines.pipelines.map(getProjectCurrentStatus))
}

exports.getProjects = getProjects
exports.translateExecution = translateExecution

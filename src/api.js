const
    builder = require('xmlbuilder'),
    codebuild = require('./codebuild')

async function handler (event) {
    const projectStatuses = await getProjectStatuses()
    const response = generateResponse(projectStatusesToXml(projectStatuses))
    console.log("Response:")
    console.log(response)
    return response;
}

async function getProjectStatuses() {
    return codebuild.getProjects()
}

function projectStatusesToXml (projects) {
    const root = builder.create('Projects')
    for (const project of projects) {
        const projectNode = root.ele('Project')
        for (const [key, value] of Object.entries(project)) {
            projectNode.att(key, value)
        }
    }
    return root.end({
        pretty: true,
        indent: '    ',
        newline: '\n',
        width: 2
    })
}

function generateResponse(body) {
    return {
        statusCode : 200,
        headers: {
            "content-type": "application/xml"
        },
        body : body
    };
}

exports.handler = handler
exports.projectStatusesToXml = projectStatusesToXml
exports.generateResponse = generateResponse

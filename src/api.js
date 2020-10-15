const
    builder = require('xmlbuilder'),
    projectsTable = require('./projectsTable')

// TODO - cache (HTTP and local)
async function handler (event) {
    const projectStatuses = await projectsTable.readProjects()
    const response = generateResponse(projectStatusesToXml(projectStatuses))
    // TODO - debug logging
    console.log("Response:")
    console.log(response)
    return response;
}

function projectStatusesToXml (projects) {
    const root = builder.create('Projects')
    for (const project of projects) {
        const projectNode = root.ele('Project')
        for (const [key, value] of Object.entries(project)) {
            if (key !== 'eventTime')
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

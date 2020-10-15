const
    projectsTable = require('./projectsTable'),
    utils = require('./utils')

function generateWebUrl(pipelineName, region) {
    return `https://console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipelineName}/view?region=${region}`
}

function processEvent(event) {
    const detail = event.detail;
    const isInProgress = detail.state === "STARTED" || detail.state === "RESUMED" || detail.state === "SUPERSEDED"
    // TODO - consider not setting this if in progress. It's required for CCMenu, but XML version can add it if it doesn't exist
    const lastBuildStatus = isInProgress || detail.state === "CANCELED"
        ? 'Unknown'
        : (detail.state === 'SUCCEEDED' ? 'Success' : 'Failure')

    const withoutBuildLabel = {
        name: detail.pipeline,
        activity: isInProgress ? 'Building' : 'Sleeping',
        lastBuildStatus: lastBuildStatus,
        lastBuildTime: event["time"],
        webUrl: generateWebUrl(detail.pipeline, event.region),
        eventTime: event["time"]
    }

    const buildLabelPart = isInProgress
        ? {}
        : {lastBuildLabel: detail["execution-id"]}

    return { ...withoutBuildLabel, ...buildLabelPart}
}

async function handler (event) {
    utils.debugLogJSON(event)
    const ccStarEvent = processEvent(event)
    await projectsTable.saveProject(ccStarEvent)
    utils.debugLogJSON(ccStarEvent)
}

exports.handler = handler
exports.processEvent = processEvent

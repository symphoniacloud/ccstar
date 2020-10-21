
function generateWebUrlFromArn(arn) {
    const arnParts = arn.split(':')
    const project = arnParts[5].split('/')[1]
    return `https://console.aws.amazon.com/codesuite/codebuild/${arnParts[4]}/projects/${project}?region=${arnParts[3]}`
}

function codeBuildEventToCCStarEvent(event) {
    const detail = event.detail;
    const isInProgress = detail["build-status"] === "IN_PROGRESS"
    // TODO - consider not setting this if in progress. It's required for CCMenu, but XML version can add it if it doesn't exist
    const lastBuildStatus = detail["build-status"] === "IN_PROGRESS" || detail["build-status"] === 'STOPPED'
        ? 'Unknown'
        : (detail["build-status"] === 'SUCCEEDED' ? 'Success' : 'Failure')

    const withoutBuildLabel = {
        name: detail["project-name"],
        activity: isInProgress ? 'Building' : 'Sleeping',
        lastBuildStatus: lastBuildStatus,
        lastBuildTime: event["time"],
        webUrl: generateWebUrlFromArn(detail["build-id"]),
        eventTime: event["time"]
    }

    const buildLabelPart = isInProgress
        ? {}
        : {lastBuildLabel: `${detail["additional-information"]["build-number"]}`}

    return { ...withoutBuildLabel, ...buildLabelPart}
}

exports.codeBuildEventToCCStarEvent = codeBuildEventToCCStarEvent

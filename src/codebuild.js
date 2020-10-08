const AWS = require("aws-sdk"),
    codebuild = new AWS.CodeBuild();

function generateWebUrlFromArn(arn) {
    const arnParts = arn.split(':')
    const project = arnParts[5].split('/')[1]
    return `https://console.aws.amazon.com/codesuite/codebuild/${arnParts[4]}/projects/${project}?region=${arnParts[3]}`
}

function translateBuild(build) {
    const isCompleted = build.currentPhase === 'COMPLETED'

    // In theory could look at previous build for lastBuildStatus when build in progress
    const lastBuildStatus = isCompleted
        ? (build.buildStatus === 'SUCCEEDED' ? 'Success' : 'Failure')
        : 'Unknown'

    return {
        name: build.projectName,
        activity: isCompleted ? 'Sleeping' : 'Building',
        lastBuildStatus: lastBuildStatus,
        lastBuildLabel: `${build.buildNumber}`,
        lastBuildTime: build.startTime.toISOString(),
        webUrl: generateWebUrlFromArn(build.arn)
    }
}

async function getProjectCurrentStatus(projectName) {
    const buildsForProject = await codebuild.listBuildsForProject({
        projectName: projectName
    }).promise()

    // // Ignore projects with no builds yet
    const builds= await codebuild.batchGetBuilds({
        ids: [ buildsForProject.ids[0] ]
    }).promise()

    return translateBuild(builds.builds[0])
}

async function getProjects() {
    // TODO - paging, etc.
    const allProjects = await codebuild.listProjects({}).promise()
    return await Promise.all(allProjects.projects.map(getProjectCurrentStatus))
}

exports.getProjects = getProjects
exports.translateBuild = translateBuild

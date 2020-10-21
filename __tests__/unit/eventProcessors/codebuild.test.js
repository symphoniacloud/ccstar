const {test, expect} = require("@jest/globals"),
    codebuild = require('../../../src/eventProcessors/codebuild.js'),
    testData = require('../../testData/codeBuildEvents')

test('should translate CW started event to project status', () => {
    const response = codebuild.codeBuildEventToCCStarEvent(testData.startedEvent)
    expect(response).toEqual({
        name: "TestProject",
        activity: 'Building',
        lastBuildStatus: 'Unknown',
        // lastBuildLabel: '1',
        // Is this the correct format? CCMenu might be having problems
        lastBuildTime: "2020-10-14T21:28:52Z",
        webUrl: 'https://console.aws.amazon.com/codesuite/codebuild/123456789012/projects/TestProject?region=us-east-1',
        eventTime: "2020-10-14T21:28:52Z"
    })
})

test('should translate CW succeeded event to project status', () => {
    const response = codebuild.codeBuildEventToCCStarEvent(testData.succeededEvent)
    expect(response).toEqual({
        name: "TestProject",
        activity: 'Sleeping',
        lastBuildStatus: 'Success',
        lastBuildLabel: '4',
        // Is this the correct format? CCMenu might be having problems
        lastBuildTime: "2020-10-14T21:29:48Z",
        webUrl: 'https://console.aws.amazon.com/codesuite/codebuild/123456789012/projects/TestProject?region=us-east-1',
        eventTime: "2020-10-14T21:29:48Z"
    })
})

test('should translate CW failed event to project status', () => {
    const event = {
        detail: {
            "build-status": "FAILED",
            "build-id": "arn:aws:codebuild:us-east-1:123456789012:build/TestProject:12345678-1234-1234-1234-1234567890ab",
            "additional-information" : { }
        }
    }
    const response = codebuild.codeBuildEventToCCStarEvent(event)

    expect(response["lastBuildStatus"]).toEqual("Failure")
    expect(response["activity"]).toEqual("Sleeping")
})

test('should translate CW stopped event to project status', () => {
    const event = {
        detail: {
            "build-status": "STOPPED",
            "build-id": "arn:aws:codebuild:us-east-1:123456789012:build/TestProject:12345678-1234-1234-1234-1234567890ab",
            "additional-information" : {
                "build-start-time": "Oct 14, 2020 9:28:52 PM"
            }
        }
    }
    const response = codebuild.codeBuildEventToCCStarEvent(event)

    expect(response["lastBuildStatus"]).toEqual("Unknown")
    expect(response["activity"]).toEqual("Sleeping")
})



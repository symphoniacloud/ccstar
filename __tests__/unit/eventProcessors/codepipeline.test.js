const {test, expect} = require("@jest/globals"),
    codepipeline = require('../../../src/eventProcessors/codepipeline'),
    testData = require('../../testData/codePipelineEvents')

test('should translate CW started event to project status', () => {
    const response = codepipeline.codePipelineEventToCCStarEvent(testData.startedEvent)
    expect(response).toEqual({
        name: "TestPipeline",
        activity: 'Building',
        lastBuildStatus: 'Unknown',
        // lastBuildLabel: '1',
        // Is this the correct format? CCMenu might be having problems
        lastBuildTime: '2020-10-15T15:07:36Z',
        webUrl: 'https://console.aws.amazon.com/codesuite/codepipeline/pipelines/TestPipeline/view?region=us-east-1',
        eventTime: "2020-10-15T15:07:36Z"
    })
})

test('should translate CW succeeded event to project status', () => {
    const response = codepipeline.codePipelineEventToCCStarEvent(testData.succeededEvent)
    expect(response).toEqual({
        name: "TestPipeline",
        activity: 'Sleeping',
        lastBuildStatus: 'Success',
        lastBuildLabel: "87654321-1234-1234-1234-1234567890ab",
        // Is this the correct format? CCMenu might be having problems
        lastBuildTime: '2020-10-15T17:51:01Z',
        webUrl: 'https://console.aws.amazon.com/codesuite/codepipeline/pipelines/TestPipeline/view?region=us-east-1',
        eventTime: "2020-10-15T17:51:01Z"
    })
})

test('should translate CW failed event to project status', () => {
    const response = codepipeline.codePipelineEventToCCStarEvent(testData.failedEvent)
    expect(response).toEqual({
        name: "TestPipeline",
        activity: 'Sleeping',
        lastBuildStatus: 'Failure',
        lastBuildLabel: "87654321-1234-1234-1234-1234567890ab",
        // Is this the correct format? CCMenu might be having problems
        lastBuildTime: '2020-10-15T17:51:01Z',
        webUrl: 'https://console.aws.amazon.com/codesuite/codepipeline/pipelines/TestPipeline/view?region=us-east-1',
        eventTime: "2020-10-15T17:51:01Z"
    })
})

test('should translate CW canceled event to project status', () => {
    const event = {
        detail: {
            "state": "CANCELED"
        }
    }
    const response = codepipeline.codePipelineEventToCCStarEvent(event)

    expect(response["lastBuildStatus"]).toEqual("Unknown")
    expect(response["activity"]).toEqual("Sleeping")
})

test('should translate CW resumed event to project status', () => {
    const event = {
        detail: {
            "state": "RESUMED"
        }
    }
    const response = codepipeline.codePipelineEventToCCStarEvent(event)

    expect(response["lastBuildStatus"]).toEqual("Unknown")
    expect(response["activity"]).toEqual("Building")
})

test('should translate CW superseded event to project status', () => {
    const event = {
        detail: {
            "state": "SUPERSEDED"
        }
    }
    const response = codepipeline.codePipelineEventToCCStarEvent(event)

    expect(response["lastBuildStatus"]).toEqual("Unknown")
    expect(response["activity"]).toEqual("Building")
})
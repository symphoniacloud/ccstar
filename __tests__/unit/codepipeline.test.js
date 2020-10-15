const {test, expect} = require("@jest/globals"),
    codepipeline = require('../../src/codepipeline.js');

test('should translate CW started event to project status', () => {
    const response = codepipeline.processEvent(startedEvent)
    expect(response).toEqual({
        name: "TestProject",
        activity: 'Building',
        lastBuildStatus: 'Unknown',
        // lastBuildLabel: '1',
        // Is this the correct format? CCMenu might be having problems
        lastBuildTime: '2020-10-15T15:07:36Z',
        webUrl: 'https://console.aws.amazon.com/codesuite/codepipeline/pipelines/TestProject/view?region=us-east-1',
        eventTime: "2020-10-15T15:07:36Z"
    })
})

test('should translate CW succeeded event to project status', () => {
    const response = codepipeline.processEvent(succeededEvent)
    expect(response).toEqual({
        name: "TestProject",
        activity: 'Sleeping',
        lastBuildStatus: 'Success',
        lastBuildLabel: "87654321-1234-1234-1234-1234567890ab",
        // Is this the correct format? CCMenu might be having problems
        lastBuildTime: '2020-10-15T17:51:01Z',
        webUrl: 'https://console.aws.amazon.com/codesuite/codepipeline/pipelines/TestProject/view?region=us-east-1',
        eventTime: "2020-10-15T17:51:01Z"
    })
})

test('should translate CW failed event to project status', () => {
    const response = codepipeline.processEvent(failedEvent)
    expect(response).toEqual({
        name: "TestProject",
        activity: 'Sleeping',
        lastBuildStatus: 'Failure',
        lastBuildLabel: "87654321-1234-1234-1234-1234567890ab",
        // Is this the correct format? CCMenu might be having problems
        lastBuildTime: '2020-10-15T17:51:01Z',
        webUrl: 'https://console.aws.amazon.com/codesuite/codepipeline/pipelines/TestProject/view?region=us-east-1',
        eventTime: "2020-10-15T17:51:01Z"
    })
})

test('should translate CW canceled event to project status', () => {
    const event = {
        detail: {
            "state": "CANCELED"
        }
    }
    const response = codepipeline.processEvent(event)

    expect(response["lastBuildStatus"]).toEqual("Unknown")
    expect(response["activity"]).toEqual("Sleeping")
})

test('should translate CW resumed event to project status', () => {
    const event = {
        detail: {
            "state": "RESUMED"
        }
    }
    const response = codepipeline.processEvent(event)

    expect(response["lastBuildStatus"]).toEqual("Unknown")
    expect(response["activity"]).toEqual("Building")
})

test('should translate CW superseded event to project status', () => {
    const event = {
        detail: {
            "state": "SUPERSEDED"
        }
    }
    const response = codepipeline.processEvent(event)

    expect(response["lastBuildStatus"]).toEqual("Unknown")
    expect(response["activity"]).toEqual("Building")
})

const startedEvent = {
    "version": "0",
    "id": "12345678-1234-1234-1234-1234567890ab",
    "detail-type": "CodePipeline Pipeline Execution State Change",
    "source": "aws.codepipeline",
    "account": "123456789012",
    "time": "2020-10-15T15:07:36Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:codepipeline:us-east-1:123456789012:TestProject"
    ],
    "detail": {
        "pipeline": "TestProject",
        "execution-id": "87654321-1234-1234-1234-1234567890ab",
        "state": "STARTED",
        "version": 1
    }
}

const succeededEvent = {
    "version": "0",
    "id": "12345678-1234-1234-1234-1234567890ab",
    "detail-type": "CodePipeline Pipeline Execution State Change",
    "source": "aws.codepipeline",
    "account": "123456789012",
    "time": "2020-10-15T17:51:01Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:codepipeline:us-east-1:123456789012:TestProject"
    ],
    "detail": {
        "pipeline": "TestProject",
        "execution-id": "87654321-1234-1234-1234-1234567890ab",
        "state": "SUCCEEDED",
        "version": 1
    }
}

const failedEvent = {
    "version": "0",
    "id": "12345678-1234-1234-1234-1234567890ab",
    "detail-type": "CodePipeline Pipeline Execution State Change",
    "source": "aws.codepipeline",
    "account": "123456789012",
    "time": "2020-10-15T17:51:01Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:codepipeline:us-east-1:123456789012:TestProject"
    ],
    "detail": {
        "pipeline": "TestProject",
        "execution-id": "87654321-1234-1234-1234-1234567890ab",
        "state": "FAILED",
        "version": 1
    }
}


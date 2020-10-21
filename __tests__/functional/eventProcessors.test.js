const {test, expect} = require("@jest/globals"),
    eventProcessor = require('../../src/eventProcessors/eventProcessor'),
    codeBuildTestData = require('../testData/codeBuildEvents'),
    codePipelineTestData = require('../testData/codePipelineEvents')

class MockDynamoDb {
    constructor() {
        this.putCalls = []
    }
    async put(params) {
        this.putCalls.push(params)
    }
}

test('Test codebuild events', async () => {
    const mockDb = new MockDynamoDb()
    const processor = new eventProcessor.EventProcessor(
        {"PROJECTS_TABLE": "NOTUSED"},
        mockDb)

    await processor.processCodeBuildEvent(codeBuildTestData.startedEvent)
    await processor.processCodeBuildEvent(codeBuildTestData.succeededEvent)

    expect(mockDb.putCalls).toHaveLength(2)
    expect(mockDb.putCalls[0]).toEqual({
        "ConditionExpression": "NOT #time >= :newTime",
        "ExpressionAttributeNames": {
            "#time": "eventTime"
        },
        "ExpressionAttributeValues": {
            ":newTime": "2020-10-14T21:28:52Z"
        },
        "Item": {
            "activity": "Building",
            "eventTime": "2020-10-14T21:28:52Z",
            "lastBuildStatus": "Unknown",
            "lastBuildTime": "2020-10-14T21:28:52Z",
            "name": "TestProject",
            "webUrl": "https://console.aws.amazon.com/codesuite/codebuild/123456789012/projects/TestProject?region=us-east-1"
        },
        "TableName": "NOTUSED"
    })
})

test('Test codepipeline events', async () => {
    const mockDb = new MockDynamoDb()
    const processor = new eventProcessor.EventProcessor(
        {"PROJECTS_TABLE": "NOTUSED"},
        mockDb)

    await processor.processCodePipelineEvent(codePipelineTestData.succeededEvent)
    await processor.processCodePipelineEvent(codePipelineTestData.failedEvent)

    expect(mockDb.putCalls).toHaveLength(2)
    expect(mockDb.putCalls[0]).toEqual({
        "ConditionExpression": "NOT #time >= :newTime",
        "ExpressionAttributeNames": {
            "#time": "eventTime"
        },
        "ExpressionAttributeValues": {
            ":newTime": "2020-10-15T17:51:01Z"
        },
        "Item": {
            "activity": "Sleeping",
            "eventTime": "2020-10-15T17:51:01Z",
            "lastBuildLabel": "87654321-1234-1234-1234-1234567890ab",
            "lastBuildStatus": "Success",
            "lastBuildTime": "2020-10-15T17:51:01Z",
            "name": "TestPipeline",
            "webUrl": "https://console.aws.amazon.com/codesuite/codepipeline/pipelines/TestPipeline/view?region=us-east-1"
        },
        "TableName": "NOTUSED"
    })
})


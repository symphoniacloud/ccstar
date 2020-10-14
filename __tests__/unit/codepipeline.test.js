const {test, expect} = require("@jest/globals"),
    codepipeline = require('../../src/codepipeline.js');

test('should translate build to project status', () => {
    const response = codepipeline.translateExecution(
        "TestPipeline",
        {
            pipelineExecutionId: "3d118dc8-8c72-4a03-b5b0-55b088232f03",
            status: "Succeeded",
            startTime: new Date("2020-02-21T16:30:19.287Z"),
            lastUpdateTime: new Date("2020-02-21T16:32:34.796Z"),
        })
    expect(response).toEqual({
        name: "TestPipeline",
        activity: 'Sleeping',
        lastBuildStatus: 'Success', // if COMPLETED then .buildStatus
        lastBuildLabel: '3d118dc8-8c72-4a03-b5b0-55b088232f03',
        // Is this the correct format? CCMenu might be having problems
        lastBuildTime: '2020-02-21T16:30:19.287Z',
        webUrl: 'https://console.aws.amazon.com/codesuite/codepipeline/pipelines/TestPipeline/view'
    })
})

test('should return building activity and unknown last status when not completed', () => {
    const response = codepipeline.translateExecution(
        "TestPipeline",
        {
            pipelineExecutionId: "3d118dc8-8c72-4a03-b5b0-55b088232f03",
            status: "InProgress",
            startTime: new Date("2020-02-21T16:30:19.287Z"),
            lastUpdateTime: new Date("2020-02-21T16:32:34.796Z"),
        })
    expect(response.activity).toEqual('Building')
    expect(response.lastBuildStatus).toEqual('Unknown')
})

test('should return Sleeping activity and failed status when completed and failed', () => {
    const response = codepipeline.translateExecution(
        "TestPipeline",
        {
            pipelineExecutionId: "3d118dc8-8c72-4a03-b5b0-55b088232f03",
            status: "Failed",
            startTime: new Date("2020-02-21T16:30:19.287Z"),
            lastUpdateTime: new Date("2020-02-21T16:32:34.796Z"),
        })
    expect(response.activity).toEqual('Sleeping')
    expect(response.lastBuildStatus).toEqual('Failure')
})

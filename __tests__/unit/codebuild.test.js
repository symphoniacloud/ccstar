const {test, expect} = require("@jest/globals"),
    codebuild = require('../../src/codebuild.js');

test('should translate build to project status', () => {
    const response = codebuild.translateBuild({
        projectName: "TestProject",
        buildNumber: 1,
        currentPhase: 'COMPLETED',
        buildStatus: 'SUCCEEDED',
        startTime: new Date('28 September 2005 10:30:34 UTC'),
        arn: "arn:aws:codebuild:us-east-1:123456789012:build/TestProject:12345678-1234-1234-1234-1234567890ab"
    })
    expect(response).toEqual({
        name: "TestProject",
        activity: 'Sleeping',
        lastBuildStatus: 'Success', // if COMPLETED then .buildStatus
        lastBuildLabel: '1',
        // Is this the correct format? CCMenu might be having problems
        lastBuildTime: '2005-09-28T10:30:34.000Z',
        webUrl: 'https://console.aws.amazon.com/codesuite/codebuild/123456789012/projects/TestProject?region=us-east-1'
    })
})

test('should return building activity and unknown last status when not completed', () => {
    const response = codebuild.translateBuild({
        projectName: "TestProject",
        buildNumber: 1,
        currentPhase: 'BUILD',
        buildStatus: 'SUCCEEDED',
        startTime: new Date('28 September 2005 10:30:34 UTC'),
        arn: "arn:aws:codebuild:us-east-1:123456789012:build/TestProject:12345678-1234-1234-1234-1234567890ab"
    })
    expect(response.activity).toEqual('Building')
    expect(response.lastBuildStatus).toEqual('Unknown')
})

test('should return Sleeping activity and failed status when completed and failed', () => {
    const response = codebuild.translateBuild({
        projectName: "TestProject",
        buildNumber: 1,
        currentPhase: 'COMPLETED',
        buildStatus: 'FAILED',
        startTime: new Date('28 September 2005 10:30:34 UTC'),
        arn: "arn:aws:codebuild:us-east-1:123456789012:build/TestProject:12345678-1234-1234-1234-1234567890ab"
    })
    expect(response.activity).toEqual('Sleeping')
    expect(response.lastBuildStatus).toEqual('Failure')
})

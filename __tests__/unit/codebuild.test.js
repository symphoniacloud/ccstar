const {test, expect} = require("@jest/globals"),
    codebuild = require('../../src/codebuild.js');

test('should translate CW started event to project status', () => {
    const response = codebuild.processEvent(startedEvent)
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
    const response = codebuild.processEvent(succeededEvent)
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
    const response = codebuild.processEvent(event)

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
    const response = codebuild.processEvent(event)

    expect(response["lastBuildStatus"]).toEqual("Unknown")
    expect(response["activity"]).toEqual("Sleeping")
})


const startedEvent = {
    "version": "0",
    "id": "87654321-1234-1234-1234-1234567890ab",
    "detail-type": "CodeBuild Build State Change",
    "source": "aws.codebuild",
    "account": "123456789012",
    "time": "2020-10-14T21:28:52Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:codebuild:us-east-1:123456789012:build/TestProject:12345678-1234-1234-1234-1234567890ab"
    ],
    "detail": {
        "build-status": "IN_PROGRESS",
        "project-name": "TestProject",
        "build-id": "arn:aws:codebuild:us-east-1:123456789012:build/TestProject:12345678-1234-1234-1234-1234567890ab",
        "additional-information": {
            "cache": {
                "type": "NO_CACHE"
            },
            "timeout-in-minutes": 60,
            "build-complete": false,
            "initiator": "OrganizationAccountAccessRole/foo@example.com",
            "build-start-time": "Oct 14, 2020 9:28:52 PM",
            "source": {
                "report-build-status": false,
                "buildspec": "test-buildspec.yaml",
                "location": "https://github.com/example/example.git",
                "type": "GITHUB"
            },
            "artifact": {
                "location": ""
            },
            "environment": {
                "image": "aws/codebuild/amazonlinux2-x86_64-standard:3.0",
                "privileged-mode": false,
                "image-pull-credentials-type": "CODEBUILD",
                "compute-type": "BUILD_GENERAL1_SMALL",
                "type": "LINUX_CONTAINER",
                "environment-variables": []
            },
            "logs": {
                "deep-link": "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logEvent:group=null;stream=null"
            },
            "queued-timeout-in-minutes": 480
        },
        "current-phase": "SUBMITTED",
        "current-phase-context": "[]",
        "version": "1"
    }
}

const succeededEvent = {
    "version": "0",
    "id": "12344321-1234-1234-1234-1234567890ab",
    "detail-type": "CodeBuild Build State Change",
    "source": "aws.codebuild",
    "account": "123456789012",
    "time": "2020-10-14T21:29:48Z",
    "region": "us-east-1",
    "resources": [
        "arn:aws:codebuild:us-east-1:123456789012:build/TestProject:12345678-1234-1234-1234-1234567890ab"
    ],
    "detail": {
        "build-status": "SUCCEEDED",
        "project-name": "TestProject",
        "build-id": "arn:aws:codebuild:us-east-1:123456789012:build/TestProject:12345678-1234-1234-1234-1234567890ab",
        "additional-information": {
            "cache": {
                "type": "NO_CACHE"
            },
            "build-number": 4,
            "timeout-in-minutes": 60,
            "build-complete": true,
            "initiator": "OrganizationAccountAccessRole/foo@example.com",
            "build-start-time": "Oct 14, 2020 9:28:52 PM",
            "source": {
                "report-build-status": false,
                "buildspec": "test-buildspec.yaml",
                "location": "https://github.com/example/example.git",
                "type": "GITHUB"
            },
            "artifact": {
                "location": ""
            },
            "environment": {
                "image": "aws/codebuild/amazonlinux2-x86_64-standard:3.0",
                "privileged-mode": false,
                "image-pull-credentials-type": "CODEBUILD",
                "compute-type": "BUILD_GENERAL1_SMALL",
                "type": "LINUX_CONTAINER",
                "environment-variables": []
            },
            "logs": {
                "group-name": "/aws/codebuild/TestProject",
                "stream-name": "12345678-1234-1234-1234-1234567890ab",
                "deep-link": "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logEvent:group=/aws/codebuild/TestProject;stream=12345678-1234-1234-1234-1234567890ab"
            },
            "phases": [
                {
                    "phase-context": [],
                    "start-time": "Oct 14, 2020 9:28:52 PM",
                    "end-time": "Oct 14, 2020 9:28:52 PM",
                    "duration-in-seconds": 0,
                    "phase-type": "SUBMITTED",
                    "phase-status": "SUCCEEDED"
                },
                {
                    "phase-context": [],
                    "start-time": "Oct 14, 2020 9:28:52 PM",
                    "end-time": "Oct 14, 2020 9:28:53 PM",
                    "duration-in-seconds": 1,
                    "phase-type": "QUEUED",
                    "phase-status": "SUCCEEDED"
                },
                {
                    "phase-context": [
                        ": "
                    ],
                    "start-time": "Oct 14, 2020 9:28:53 PM",
                    "end-time": "Oct 14, 2020 9:29:18 PM",
                    "duration-in-seconds": 24,
                    "phase-type": "PROVISIONING",
                    "phase-status": "SUCCEEDED"
                },
                {
                    "phase-context": [
                        ": "
                    ],
                    "start-time": "Oct 14, 2020 9:29:18 PM",
                    "end-time": "Oct 14, 2020 9:29:33 PM",
                    "duration-in-seconds": 15,
                    "phase-type": "DOWNLOAD_SOURCE",
                    "phase-status": "SUCCEEDED"
                },
                {
                    "phase-context": [
                        ": "
                    ],
                    "start-time": "Oct 14, 2020 9:29:33 PM",
                    "end-time": "Oct 14, 2020 9:29:33 PM",
                    "duration-in-seconds": 0,
                    "phase-type": "INSTALL",
                    "phase-status": "SUCCEEDED"
                },
                {
                    "phase-context": [
                        ": "
                    ],
                    "start-time": "Oct 14, 2020 9:29:33 PM",
                    "end-time": "Oct 14, 2020 9:29:33 PM",
                    "duration-in-seconds": 0,
                    "phase-type": "PRE_BUILD",
                    "phase-status": "SUCCEEDED"
                },
                {
                    "phase-context": [
                        ": "
                    ],
                    "start-time": "Oct 14, 2020 9:29:33 PM",
                    "end-time": "Oct 14, 2020 9:29:44 PM",
                    "duration-in-seconds": 11,
                    "phase-type": "BUILD",
                    "phase-status": "SUCCEEDED"
                },
                {
                    "phase-context": [
                        ": "
                    ],
                    "start-time": "Oct 14, 2020 9:29:44 PM",
                    "end-time": "Oct 14, 2020 9:29:45 PM",
                    "duration-in-seconds": 0,
                    "phase-type": "POST_BUILD",
                    "phase-status": "SUCCEEDED"
                },
                {
                    "phase-context": [
                        ": "
                    ],
                    "start-time": "Oct 14, 2020 9:29:45 PM",
                    "end-time": "Oct 14, 2020 9:29:45 PM",
                    "duration-in-seconds": 0,
                    "phase-type": "UPLOAD_ARTIFACTS",
                    "phase-status": "SUCCEEDED"
                },
                {
                    "phase-context": [
                        ": "
                    ],
                    "start-time": "Oct 14, 2020 9:29:45 PM",
                    "end-time": "Oct 14, 2020 9:29:47 PM",
                    "duration-in-seconds": 2,
                    "phase-type": "FINALIZING",
                    "phase-status": "SUCCEEDED"
                },
                {
                    "start-time": "Oct 14, 2020 9:29:47 PM",
                    "phase-type": "COMPLETED"
                }
            ],
            "queued-timeout-in-minutes": 480
        },
        "current-phase": "COMPLETED",
        "current-phase-context": "[: ]",
        "version": "1"
    }
}
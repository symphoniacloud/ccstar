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
        "pipeline": "TestPipeline",
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
        "pipeline": "TestPipeline",
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
        "pipeline": "TestPipeline",
        "execution-id": "87654321-1234-1234-1234-1234567890ab",
        "state": "FAILED",
        "version": 1
    }
}

exports.startedEvent = startedEvent
exports.succeededEvent = succeededEvent
exports.failedEvent = failedEvent
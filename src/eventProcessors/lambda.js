const
    eventProcessor = require('./eventProcessor'),
    dynamoDb = require('../common/dynamoDb')

const processor = new eventProcessor.EventProcessor(
    process.env,
    new dynamoDb.DynamoDb()
)

async function codeBuildHandler(event) {
    return processor.processCodeBuildEvent(event)
}

async function codePipelineHandler(event) {
    return processor.processCodePipelineEvent(event)
}

exports.codeBuildHandler = codeBuildHandler
exports.codePipelineHandler = codePipelineHandler

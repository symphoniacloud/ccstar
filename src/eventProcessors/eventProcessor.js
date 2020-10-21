const
    projectsTable = require('../common/projectsTable'),
    utils = require('../common/utils'),
    codeBuild = require('./codebuild'),
    codePipeline = require('./codepipeline')

class EventProcessor {
    constructor(configMap, dynamoDb) {
        const logLevel = utils.mapValueOrDefault(configMap, "LOG_LEVEL", "INFO").toUpperCase()
        const projectsTableName = utils.mapValueOrThrow(configMap, "PROJECTS_TABLE")
        this.logger = new utils.Logger(logLevel)
        this.projectsTable = new projectsTable.ProjectsTable(dynamoDb, projectsTableName)
    }

    async processCodeBuildEvent(event) {
        return this.processEvent(event, codeBuild.codeBuildEventToCCStarEvent)
    }

    async processCodePipelineEvent(event) {
        return this.processEvent(event, codePipeline.codePipelineEventToCCStarEvent)
    }

    async processEvent(event, toCCStarEventTranslator) {
        this.logger.debugLogJSON(event)
        const ccStarEvent = toCCStarEventTranslator(event)
        await this.projectsTable.saveProject(ccStarEvent)
        this.logger.debugLogJSON(ccStarEvent)
    }
}

exports.EventProcessor = EventProcessor
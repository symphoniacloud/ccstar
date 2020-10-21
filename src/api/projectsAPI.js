const
    builder = require('xmlbuilder'),
    basicAuth = require('./basicAuth'),
    localCache = require('./localCache'),
    utils = require('../common/utils'),
    projectsTable = require('../common/projectsTable'),
    configLoader = require('./configLoader')

class LatestResponseGenerator {
    constructor(dynamoDb, config) {
        this.projects = new projectsTable.ProjectsTable(dynamoDb, config.projectsTableName)
    }

    async getLatest() {
        const projectStatuses = await this.projects.readProjects()
        return generateOKResponse(projectStatusesToXml(projectStatuses))
    }
}

class API {
    constructor(configMap, dynamoDb) {
        this.config = configLoader.load(configMap)
        this.logger = new utils.Logger(this.config.logLevel)
        this.cache = new localCache.createCache(new LatestResponseGenerator(dynamoDb, this.config), this.config, this.logger)
    }

    async ccTrayXml(apiGatewayEvent) {
        this.logger.debugLogJSON(apiGatewayEvent)

        if (this.config.useBasicAuth && !basicAuth.isAuthorized(apiGatewayEvent, this.config.basicAuthUserPasswordMap)) {
            return unauthorizedResponseRequiringBasicAuth
        }

        const response = await this.cache.getValue()
        this.logger.debugLog("Response:")
        this.logger.debugLogJSON(response)
        return response;
    }
}

function projectStatusesToXml (projects) {
    const root = builder.create('Projects')
    for (const project of projects) {
        const projectNode = root.ele('Project')
        for (const [key, value] of Object.entries(project)) {
            if (key !== 'eventTime')
                projectNode.att(key, value)
        }
    }
    return root.end({
        pretty: true,
        indent: '    ',
        newline: '\n',
        width: 2
    })
}

function generateOKResponse(body) {
    return {
        statusCode : 200,
        headers: {
            "content-type": "application/xml"
        },
        body : body
    };
}

const unauthorizedResponseRequiringBasicAuth = {
    statusCode : 401,
    headers: {
        "WWW-Authenticate": "Basic"
    }
}

exports.API = API
exports.projectStatusesToXml = projectStatusesToXml
exports.generateOKResponse = generateOKResponse

const
    builder = require('xmlbuilder'),
    projectsTable = require('./projectsTable'),
    utils = require('./utils'),
    nodeCache = require('node-cache')

const responseCacheKey = 'response'
const localCacheExpirySeconds = parseInt(process.env.LOCAL_CACHE_TTL)
const useCache = localCacheExpirySeconds > 0
if (useCache) {
    utils.debugLog(`Using local cache with TTL of ${localCacheExpirySeconds} seconds`)
} else {
    utils.debugLog("Environment Variable LOCAL_CACHE_TTL set to zero - not using local cache")
}
const cache = useCache ? new nodeCache({ stdTTL: localCacheExpirySeconds }) : null

// TODO - cache (HTTP)
async function handler (event) {
    const response = await getResponse()
    utils.debugLog("Response:")
    utils.debugLogJSON(response)
    return response;
}

async function getResponseForLatestData() {
    const projectStatuses = await projectsTable.readProjects()
    return generateResponse(projectStatusesToXml(projectStatuses))
}

async function getResponse() {
    if (! useCache) {
        return await getResponseForLatestData()
    } else {
        const cached = cache.get(responseCacheKey)
        if (cached === undefined) {
            utils.debugLog("Cache miss - generating new response")
            const response = await getResponseForLatestData()
            cache.set(responseCacheKey, response)
            return response
        }
        utils.debugLog("Using cached response")
        return cached
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

function generateResponse(body) {
    return {
        statusCode : 200,
        headers: {
            "content-type": "application/xml"
        },
        body : body
    };
}

exports.handler = handler
exports.projectStatusesToXml = projectStatusesToXml
exports.generateResponse = generateResponse

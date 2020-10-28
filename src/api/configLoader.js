const utils = require('../common/utils')

function load(configMap) {
    const projectsTable = utils.mapValueOrThrow(configMap, "PROJECTS_TABLE")
    const logLevel = utils.mapValueOrDefault(configMap, "LOG_LEVEL", "INFO").toUpperCase()
    const basicAuthType = utils.mapValueOrDefault(configMap, "BASIC_AUTH_TYPE", "NONE").toUpperCase()
    const basicAuthConfig = utils.mapValueOrDefault(configMap, "BASIC_AUTH_CONFIG", "")
    const localCacheTTL = parseInt(utils.mapValueOrDefault(configMap, "LOCAL_CACHE_TTL", "0"))

    return {
        projectsTableName: projectsTable,
        logLevel: logLevel,
        basicAuthMapType: basicAuthType,
        useBasicAuth: basicAuthType !== "NONE",
        basicAuthUserPasswordMap: loadBasicAuthUserPasswordMap(basicAuthType, basicAuthConfig),
        localCacheTTL: localCacheTTL,
        useLocalCache: localCacheTTL > 0
    }
}

function loadBasicAuthUserPasswordMap(basicAuthType, basicAuthConfig) {
    if (basicAuthType === "NONE")
        return null;
    if (basicAuthType === "PLAINTEXTSINGLEENTRY" ) {
        const [user, password] = basicAuthConfig.split(':')
        const userMap = {}
        userMap[user] = password
        return userMap
    }
    // TODO - if we are using secrets manager then look up here, rather than in template
    throw `Unexpected auth map type: ${basicAuthType}`
}

exports.load = load
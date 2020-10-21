const utils = require('../common/utils')

function load(configMap) {
    const projectsTable = utils.mapValueOrThrow(configMap, "PROJECTS_TABLE")
    const logLevel = utils.mapValueOrDefault(configMap, "LOG_LEVEL", "INFO").toUpperCase()
    const basicAuthMapType = utils.mapValueOrDefault(configMap, "BASIC_AUTH_USER_PASSWORD_MAP_TYPE", "NONE").toUpperCase()
    const basicAuthUserPasswordConfig = utils.mapValueOrDefault(configMap, "BASIC_AUTH_USER_PASSWORD_MAP_CONFIG", "")
    const localCacheTTL = parseInt(utils.mapValueOrDefault(configMap, "LOCAL_CACHE_TTL", "0"))

    return {
        projectsTableName: projectsTable,
        logLevel: logLevel,
        basicAuthMapType: basicAuthMapType,
        useBasicAuth: basicAuthMapType !== "NONE",
        basicAuthUserPasswordMap: loadBasicAuthUserPasswordMap(basicAuthMapType, basicAuthUserPasswordConfig),
        localCacheTTL: localCacheTTL,
        useLocalCache: localCacheTTL > 0
    }
}

function loadBasicAuthUserPasswordMap(basicAuthMapType, basicAuthUserPasswordConfig) {
    if (basicAuthMapType === "NONE")
        return null;
    if (basicAuthMapType === "PLAINTEXTSINGLEENTRY") {
        const [user, password] = basicAuthUserPasswordConfig.split(' ')
        const userMap = {}
        userMap[user] = password
        return userMap
    }
    throw `Unexpected auth map type: ${basicAuthMapType}`
}

exports.load = load
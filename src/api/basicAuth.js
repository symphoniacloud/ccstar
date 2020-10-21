
function isAuthorized(event, authMap) {
    const basicAuthValue = getBasicAuth(event)
    return basicAuthValue != null && isValidBasicAuth(basicAuthValue, authMap)
}

function getBasicAuth(event) {
    const authHeader = event.headers.authorization

    if (authHeader) {
        const authHeaderTokens = authHeader.split(' ')
        if (authHeaderTokens.length === 2 && authHeaderTokens[0].toUpperCase() === 'BASIC')
            return authHeaderTokens[1]
    }

    return null
}

function isValidBasicAuth(encoded, authMap) {
    const [user, password] = (Buffer.from(encoded, 'base64')).toString().split(':')
    return authMap.hasOwnProperty(user) && authMap[user] === password
}

exports.isAuthorized = isAuthorized
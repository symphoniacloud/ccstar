
class Logger {
    constructor(logLevel) {
        this.logLevel = logLevel
        this.doDebugLog = logLevel === "DEBUG"
    }

    debugLog(logLine) {
        if (this.doDebugLog) {
            console.log(logLine)
        }
    }

    debugLogJSON(object) {
        this.debugLog(JSON.stringify(object))
    }
}

function mapValueOrThrow(map, propertyName) {
    if (map.hasOwnProperty(propertyName))
        return map[propertyName]
    else
        throw `Unable to locate required config for key ${propertyName}`
}

function mapValueOrDefault(map, propertyName, defaultValue) {
    return map.hasOwnProperty(propertyName) ? map[propertyName] : defaultValue
}

exports.Logger = Logger
exports.mapValueOrThrow = mapValueOrThrow
exports.mapValueOrDefault = mapValueOrDefault
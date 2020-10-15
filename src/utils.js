
const DEBUG_LOG =
    process.env.hasOwnProperty("LOG_LEVEL")
    && process.env.LOG_LEVEL.toUpperCase() === "DEBUG"

function debugLog(logLine) {
    if (DEBUG_LOG) {
        console.log(logLine)
    }
}

function debugLogJSON(object) {
    debugLog(JSON.stringify(object))
}

exports.debugLog = debugLog
exports.debugLogJSON = debugLogJSON

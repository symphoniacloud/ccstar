const
    projectsApi = require('./projectsAPI'),
    dynamoDb = require('../common/dynamoDb')

const api = new projectsApi.API(
    process.env,
    new dynamoDb.DynamoDb()
)

exports.handler = function (event) {
    return api.ccTrayXml(event)
}

const
    AWS = require("aws-sdk")

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.PROJECTS_TABLE

async function saveProject(event) {
    const params = {
        TableName: tableName,
        Item: event,
        // We don't say "#time < :newTime" here, since that fails if there's no item yet for this project
        ConditionExpression: "NOT #time >= :newTime",
        ExpressionAttributeNames: {"#time": "eventTime"},
        ExpressionAttributeValues: {":newTime": event["eventTime"]}
    }
    try {
        await docClient.put(params).promise()
    }
    catch (e) {
        if (e.name === "ConditionalCheckFailedException") {
            console.log("We already have later events for this project - discarding this event")
        } else {
            throw e;  // re-throw the error unchanged
        }
    }
}

async function readProjects() {
    const dbResult = await docClient.scan({
        TableName: tableName,
    }).promise()
    return dbResult.Items
}

exports.saveProject = saveProject
exports.readProjects = readProjects
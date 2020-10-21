// This exists mostly so we can stub it out for functional tests

const AWS = require("aws-sdk")

const docClient = new AWS.DynamoDB.DocumentClient();

class DynamoDb {
    async put(params) {
        await docClient.put(params).promise()
    }

    async scan(params) {
        return (await docClient.scan(params).promise()).Items
    }
}

exports.DynamoDb = DynamoDb
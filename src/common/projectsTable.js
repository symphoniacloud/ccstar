
class ProjectsTable {
    constructor(dynamoDB, tableName) {
        this.dynamoDB = dynamoDB
        this.tableName = tableName
    }

    async saveProject(event) {
        const params = {
            TableName: this.tableName,
            Item: event,
            // We don't say "#time < :newTime" here, since that fails if there's no item yet for this project
            ConditionExpression: "NOT #time >= :newTime",
            ExpressionAttributeNames: {"#time": "eventTime"},
            ExpressionAttributeValues: {":newTime": event["eventTime"]}
        }
        try {
            await this.dynamoDB.put(params)
        }
        catch (e) {
            if (e.name === "ConditionalCheckFailedException") {
                console.log("We already have later events for this project - discarding this event")
            } else {
                throw e;  // re-throw the error unchanged
            }
        }
    }

    async readProjects() {
        return this.dynamoDB.scan({TableName: this.tableName})
    }
}

exports.ProjectsTable = ProjectsTable

const {test, expect} = require("@jest/globals"),
    projectsApi = require('../../src/api/projectsAPI.js');

class StubDynamoDb {
    async scan() {
        return [{
            name: 'SvnTest',
            activity: 'Sleeping',
            lastBuildStatus: 'Exception',
            lastBuildLabel: '8',
            lastBuildTime: '2005-09-28T10:30:34.6362160+01:00',
            nextBuildTime: '2005-10-04T14:31:52.4509248+01:00',
            webUrl: 'http://mrtickle/ccnet/'
        },
        {
            name: 'HelloWorld',
            activity: 'Sleeping',
            lastBuildStatus: 'Success',
            lastBuildLabel: '13',
            lastBuildTime: '2005-09-15T17:33:07.6447696+01:00',
            nextBuildTime: '2005-09-15T17:33:07.6447696+01:00',
            webUrl: 'http://mrtickle/ccnet/'
        }]
    }
}

const expectedSuccessResponse = {
    statusCode: 200,
    headers:  {
        "content-type": "application/xml"
    },
    body: `<?xml version="1.0"?>
<Projects>
    <Project
        name="SvnTest"
        activity="Sleeping"
        lastBuildStatus="Exception"
        lastBuildLabel="8"
        lastBuildTime="2005-09-28T10:30:34.6362160+01:00"
        nextBuildTime="2005-10-04T14:31:52.4509248+01:00"
        webUrl="http://mrtickle/ccnet/"/>
    <Project
        name="HelloWorld"
        activity="Sleeping"
        lastBuildStatus="Success"
        lastBuildLabel="13"
        lastBuildTime="2005-09-15T17:33:07.6447696+01:00"
        nextBuildTime="2005-09-15T17:33:07.6447696+01:00"
        webUrl="http://mrtickle/ccnet/"/>
</Projects>`
}

test('Test no caching and no auth', async () => {
    const api = new projectsApi.API(
        {"PROJECTS_TABLE": "NOTUSED"},
        new StubDynamoDb())

    const response = await api.ccTrayXml({})

    expect(response).toEqual(expectedSuccessResponse);
})

test('Test with basic auth and no auth given', async () => {
    const api = new projectsApi.API(
        {
            "PROJECTS_TABLE": "NOTUSED",
            "BASIC_AUTH_USER_PASSWORD_MAP_TYPE": "PlainTextSingleEntry",
            "BASIC_AUTH_USER_PASSWORD_MAP_CONFIG": "myuser mypassword"
        },
        new StubDynamoDb()
    )

    const response = await api.ccTrayXml({
        headers: {}
    })

    expect(response).toEqual({
        statusCode: 401,
        headers:  {
            "WWW-Authenticate": "Basic"
        }});
})

test('Test with basic auth and auth given', async () => {
    const api = new projectsApi.API(
        {
            "PROJECTS_TABLE": "NOTUSED",
            "BASIC_AUTH_USER_PASSWORD_MAP_TYPE": "PlainTextSingleEntry",
            "BASIC_AUTH_USER_PASSWORD_MAP_CONFIG": "myuser mypassword"
        },
        new StubDynamoDb()
    )

    const response = await api.ccTrayXml({
        headers: {
            authorization: `Basic ${Buffer.from("myuser:mypassword").toString('base64')}`
        }
    })

    expect(response).toEqual(expectedSuccessResponse);
})

test('Test with basic auth and wrong auth given', async () => {
    const api = new projectsApi.API(
        {
            "PROJECTS_TABLE": "NOTUSED",
            "BASIC_AUTH_USER_PASSWORD_MAP_TYPE": "PlainTextSingleEntry",
            "BASIC_AUTH_USER_PASSWORD_MAP_CONFIG": "myuser mypassword"
        },
        new StubDynamoDb()
    )

    const response = await api.ccTrayXml({
        headers: {
            authorization: `Basic ${Buffer.from("baduser:badpassword").toString('base64')}`
        }
    })

    expect(response).toEqual({
        statusCode: 401,
        headers:  {
            "WWW-Authenticate": "Basic"
        }});
})

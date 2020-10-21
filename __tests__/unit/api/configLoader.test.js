const {test, expect} = require("@jest/globals"),
    config = require('../../../src/api/configLoader.js');


test('default config', () => {
    expect(config.load({
        PROJECTS_TABLE: "MyDynamoDBTable"
    })).toEqual({
        projectsTableName: "MyDynamoDBTable",
        logLevel: "INFO",
        basicAuthMapType: "NONE",
        useBasicAuth: false,
        basicAuthUserPasswordMap: null,
        localCacheTTL: 0,
        useLocalCache: false
    })
})

test('default from expected template values', () => {
    expect(config.load({
        PROJECTS_TABLE: "MyDynamoDBTable",
        BASIC_AUTH_USER_PASSWORD_MAP_TYPE: 'None',
        BASIC_AUTH_USER_PASSWORD_MAP_CONFIG: '',
        LOCAL_CACHE_TTL: 0,
        LOG_LEVEL: "INFO"
    })).toEqual({
        projectsTableName: "MyDynamoDBTable",
        logLevel: "INFO",
        basicAuthMapType: "NONE",
        useBasicAuth: false,
        basicAuthUserPasswordMap: null,
        localCacheTTL: 0,
        useLocalCache: false
    })
})

test('with non-zero local cache TTL', () => {
    const loaded = config.load({
        PROJECTS_TABLE: "MyDynamoDBTable",
        LOCAL_CACHE_TTL: 10
    })
    expect(loaded.useLocalCache).toBeTruthy()
    expect(loaded.localCacheTTL).toEqual(10)
})

test('with debug logging', () => {
    const loaded = config.load({
        PROJECTS_TABLE: "MyDynamoDBTable",
        LOG_LEVEL: "Debug"
    })
    expect(loaded.logLevel).toEqual('DEBUG')
})

test('with single entry user / password map', () => {
    const loaded = config.load({
        PROJECTS_TABLE: "MyDynamoDBTable",
        BASIC_AUTH_USER_PASSWORD_MAP_TYPE: 'PlainTextSingleEntry',
        BASIC_AUTH_USER_PASSWORD_MAP_CONFIG: 'myuser mypassword',
    })
    expect(loaded.basicAuthMapType).toEqual('PLAINTEXTSINGLEENTRY')
    expect(loaded.basicAuthUserPasswordMap).toEqual({
        "myuser":"mypassword"
    })
})


// test('throw if no projects table')

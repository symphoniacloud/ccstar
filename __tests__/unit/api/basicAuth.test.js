const {test, expect} = require("@jest/globals"),
    basicAuth = require('../../../src/api/basicAuth.js');

const authMap = {
    'myuser': 'mypassword'
}

const validEncodedUserAndPassword = Buffer.from("myuser:mypassword").toString('base64')

test('Should authorize if user + password valid and auth header format correct', () => {
    expect(basicAuth.isAuthorized(
        {
            headers: {
                authorization: `Basic ${validEncodedUserAndPassword}`
            }
        },
        authMap
        )).toBeTruthy()
})

test('Should not authorize if no authorization header', () => {
    expect(basicAuth.isAuthorized(
        {
            headers: {}
        },
        authMap
        )).toBeFalsy()
})

test('Should not authorize authHeader if not two parts', () => {
    expect(basicAuth.isAuthorized(
        {
            headers: {
                authorization: `Basic${validEncodedUserAndPassword}`
            }
        },
        authMap
    )).toBeFalsy()
})

test('Should not authorize authHeader if first part not Basic', () => {
    expect(basicAuth.isAuthorized(
        {
            headers: {
                authorization: `SomeOtherAuth ${validEncodedUserAndPassword}`
            }
        },
        authMap
    )).toBeFalsy()
})

test('Should not authorize authHeader if user not known', () => {
    const invalidUser = Buffer.from("badbadbad:mypassword").toString('base64')
    expect(basicAuth.isAuthorized(
        {
            headers: {
                authorization: `Basic ${invalidUser}`
            }
        },
        authMap
    )).toBeFalsy()
})

test('Should not authorize authHeader if bad passwod', () => {
    const invalidUser = Buffer.from("myuser:badbadbad").toString('base64')
    expect(basicAuth.isAuthorized(
        {
            headers: {
                authorization: `Basic ${invalidUser}`
            }
        },
        authMap
    )).toBeFalsy()
})

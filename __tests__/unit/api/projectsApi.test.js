const {test, expect} = require("@jest/globals"),
    projectsApi = require('../../../src/api/projectsAPI.js');

// See https://cctray.org/v1/
test('should generate correct XML from object', () => {
    const xml = projectsApi.projectStatusesToXml([
        {
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
        }
    ])

    expect(xml).toEqual(`<?xml version="1.0"?>
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
</Projects>`);
})

test('should generate correct API Gateway response', () => {
    const response = projectsApi.generateOKResponse('<Projects/>')
    expect(response).toEqual({
        statusCode : 200,
        headers: {
            "content-type": "application/xml"
        },
        body : '<Projects/>'
    })
})

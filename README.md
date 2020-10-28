# CCStar - CCTray proxy for AWS CodeBuild and CodePipeline

A project to allow [CCTray](https://sourceforge.net/projects/ccnet/files/CruiseControl.NET%20Releases/CruiseControl.NET%201.8.5/), [CCMenu](http://ccmenu.org/), [Nevergreen](https://github.com/build-canaries/nevergreen), and other
 compatible clients to read the status of projects in AWS CodeBuild and CodePipeline via the [CCTray common format](https://cctray.org/v1/).
 
## AWS Costs

CCStar runs in your AWS account, and therefore may incur costs, depending on whether it, and the rest of your account, fit in the AWS free tier.

CCStar uses the following cost-incurring resource types:

* DynamoDB
* API Gateway
* Lambda
* (Optionally) Secrets Manager

Note that in normal situations any costs incurred should be very small, or zero if in the free tier. 
But for accounts with many active projects and/or pipelines, or a large number of people making requests, there may
 be noteworthy costs. As in all things AWS, keep an eye on your costs. 
 
## Installation

CCStar is available as a [SAR (Serverless Application Repository)](https://aws.amazon.com/serverless/serverlessrepo) application.

The easiest way to install CCStar is via the web console, but the best way is via CloudFormation, or other
 infrastructure-as-code.
 
### Installation via the web console

As a user with a good amount of privileges:

1. Go to CCStar in the SAR console, [here](https://serverlessrepo.aws.amazon.com/applications/us-east-1/073101298092/ccstar), and adjust your region as necessary.
1. Press the **Deploy** button
1. Check you're ok with everything, then press the next **Deploy** button - This will deploy CCStar as a CloudFormation stack within your account.
1. Open up CloudFormation in the Web Console, find your installation of CCStar and wait for it to complete deploying.
1. Once it has completed deploying open the **Outputs** tab - you should see a `CCTrayXMLURL` output, and the value
 of this is the CCTray URL that you can use in CCMenu, etc.
 
### Installation via infrastructure as code

This is a better way of managing CCStar over time, especially since it makes upgrading more simple.

If you use CloudFormation, you can include CCStar as an application within a parent stack. To add CCStar to a
 CloudFormation template, do the following:
 
* Make sure you have included the SAM transform in the file. You should see a line that reads `Transform: AWS::Serverless-2016-10-31`
* Add the following resource in your `Resources` section:
```yaml
  CCStar:
    Type: AWS::Serverless::Application
    Properties:
      Location:
        ApplicationId: arn:aws:serverlessrepo:us-east-1:073101298092:applications/ccstar
        SemanticVersion: 0.1.7
```
* Optionally, add the following in your template's `Outputs` section:
```yaml
  CCStarURL:
    Value: !GetAtt CCStar.Outputs.CCTrayXMLURL
```
* When deploying your script, make sure to use the `CAPABILITY_AUTO_EXPAND` capability, as well as `CAPABILITY_IAM`.

Then deploy your template. CCStar will appear as a _nested stack_ within the deployed parent stack. Once deployment
 is complete, you should see the Output value if you added it, with the URL to use in CCMenu, etc.

### Installation WITHOUT SAR

If you want to install without SAR then just download this source repo, and run the `deploy.sh` script. You may want
 to edit it a little for choosing a stack name.

## Usage

Once you've found the CCTray XML URL you should be able to use CCStar just like any other CCTray-compatible server.

Immediately after you install CCStar, however, you won't see any projects listed.
CCStar keeps its own state of your projects and pipelines by listening for events.
In other words before trying to connect to CCStar for the very first time after it's installed, kick off a project or
 pipeline to seed some data.
 
If you're not seeing any projects then check CCStar's DynamoDB table (you'll find it in the CloudFormation web
 console stack for CCStar) and see if it has any rows.

## Upgrading CCStar

I plan to update CCStar with at least a couple more items. In order to upgrade your installation of CCStar via SAR
 installed via the web console (or CLI) see [here](https://docs.aws.amazon.com/serverlessrepo/latest/devguide/serverlessrepo-how-to-consume-new-version.html) .
 
If you installed SAR as a nested CloudFormation resource as described above in hte infrastructure-as-code section
, you can simply change the `SemanticVersion` property and redeploy.

## TODOS

Basic Auth

Example for CloudFormation deployment.

Document implementation


# Adylic Services

## Introduction

This is the Adylic services monorepo which contains our backend services and reusable packages.

It consists of the following services:

1. [Creative Processor Service](./apps/creative-processor/README.md)

## Installing dependencies

In the root folder run `npm i` and once this is complete run `npm run bootstrap` which will build all of the services.

## Commiting changes

To commit changes run the following `npm run commit` which will run commitizen as shown below:

![commit](docs/images/commit.png)

## Running all services locally

In the root folder run the following command:

`npm run start`

This will run up all of the API services with serverless offline, and will deploy the stacks to localstack, all working together 🚀

### Running a single microservice/app locally

In the root folder run the following commands in separate terminals:

`npm run start:docker`
`npm run start:services -- --scope=@adylic/{microservice}`

## Running all unit tests & linting

In the root folder run the following command:

`npm run test`

optionally to watch the changes you can run the following:

`npm run test:watch`

You can run the linting with the folllowing command:

`npm run lint`

## Creating a release

To create a release and update the changelog file you run the following scripts:

`npm run release:major` - this will bump the version and tag the major version release.
`npm run release:minor` - this will bump the version and tag the minor version release.
`npm run release:patch` - this will bump the version and tag the patch version release.

> Note: To generate the first release you must run the following: `npm run release -- --first-release`

## Generating documentation

In the root folder run the following command to generate the documentation for all packages and services using tsdoc:

`npm run docs`

## Generating Open API documentation

In the root folder run the following command to generate the Open API documentation for all packages and services:

`npm run openapi`

## Style linting

In the root folder run the following command to ensure style lint is ran across all typescript code:

`npm run prettier`

## Running load/e2e tests

In the root folder run the following commands to ensure the endpoints pass the e2e/load tests:

`npm run start` # ensure that the local services are running before running the second command.

`npm run e2e`

## Todo

-   [ ] Create a cognito authoriser package
-   [ ] Swap the creative microservice authoriser for the cognito one
-   [x] Add validation package
-   [x] Add AWS response handler package
-   [x] Add the DynamoDB table through IaC
-   [x] Add the S3 bucket through IaC
-   [x] Add [conventional changelog](https://github.com/conventional-changelog/conventional-changelog)
-   [x] Add [TSDoc](https://tsdoc.org/)
-   [x] Add DynamoDB and S3 Local (localstack)
-   [ ] Create postman file for the creative microservice
-   [x] Add the load testing functionality
-   [ ] Port across the lambda layer from text-image-lambda repo

## Limitatiions (Serverless and deployments)

-   SSM parameters for local use Environment variables. For development, use serverless stack references. For Staging and prod use the serverless SSM hook to pull from AWS (must exist before serverless runs) as OMG control these.

-   A serverless deployment bucket for the microservice being deployed has to be created ahead of time by OMG and referenced in the serverless config. Recommend having one bucket per service

### Sandbox limitations:

-   Not designed for development environments, only for manual AWS console testing
-   No permissions to IAM (roles or users)
-   All resources will be wiped periodically
-   CI/CD is not available
-   Manual deployment with federated access is possible but has to be setup manually and refreshed every 6 hours when the federated login

### Staging/Prod CI/CD

-   CI/CD user has been set up for us but must only be used in the approved gitlab pipeline
-   Cannot deploy infrastructure resources, these must be referenced by ARN. See serverless helpers package to help us avoid these resources in non local or development environments
-   Any applications deployed using CI/CD, OMG are not accountable for maintenance. We must investigate issues, patch and deploy fixes ourselves.

### IAM Role Setup

For OMG environments we reference IAM roles using their ARN (created by them not the serverless framework). Use the `fetchIAMRoleArn()` function in serverless helpers. For Local environments in the **Resources** block use `fetchIAMRole()` function which generates the cloudformaton.

If it is a default role for the lambda functions use the shorter Serverless syntax for the local iam role and when setting the default role use the following syntax:

```
provider: {
        iam: { role: fetchIAMRoleArn('adyFontLambdaRole') || fetchIAMRole('adyFontLambdaRole').adyFontLambdaRole }, //default role
        ...
}
```

Short Syntax:

```
module.exports = {
    adyDefaultLambdaRole: {
        // DEFAULT ROLE - use short syntax
        statements: [
            {
                ...
            },
            {
                ...
            }
```

Otherwise use the proper cloud formation syntax:

```
adyNonDefaultRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
                ...
            },
            Policies: [
                {
                    PolicyName: '...',
                    PolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [...]
                    }
                }
            ]
        }
}
```

Remember for local you also need to add the role using fetchIAMRole to the Resources block:

```
    resources: {
        Resources: {
            ...fetchIAMRole('adyDeployStepRole'), // Local only
            ...
        }
    }
```

If you need to reference a RoleArn, then use the following to fetch from SSM or use a local cloudformation variant:

```
                 RoleArn:
                    fetchIAMRoleArn('adyDeployStepRole') !== ''
                        ? fetchIAMRoleArn('adyDeployStepRole')
                        : { 'Fn::GetAtt': ['adyDeployStepRole', 'Arn'] },
```

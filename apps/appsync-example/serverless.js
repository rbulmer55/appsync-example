const { resolve } = require('path');
const { generateRegexList, regexes } = require('regex-validation');

const mappingTemplates = require('./src/mapping-templates');
const functionConfigurations = require('./src/function-configurations');
const dataSources = require('./src/data-sources');

module.exports = {
    service: 'appsync-example',
    frameworkVersion: '2',
    useDotenv: true,
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        lambdaHashingVersion: 20201221,
        versionFunctions: false,
        stage: "${opt:stage, 'local'}",
        region: "${opt:region, 'eu-west-1'}",
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1,
        },
        deploymentBucket: {
            name: 'rb-291121',
            serverSideEncryption: 'AES256',
        },
    },
    plugins: ['serverless-appsync-plugin', 'serverless-webpack', 'serverless-deployment-bucket'],
    package: {
        individually: true,
        exclude: ['node_modules/**'],
    },
    functions: {
        appSyncReceiver: {
            name: 'robsAppSyncReceiver',
            handler: 'src/handlers/receiver/receiver.handler',
            memorySize: 128,
            timeout: 30,
        },
    },
    resources: {
        Resources: {
            appSyncSQSRole: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    Path: '/ady/lambda/customroles/',
                    RoleName: 'appsync-example-sqs-role',
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: {
                                    Service: ['appsync.amazonaws.com'],
                                },
                                Action: 'sts:AssumeRole',
                            },
                        ],
                    },
                    Policies: [
                        {
                            PolicyName: 'appsync-example-sqs-policy',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Effect: 'Allow',
                                        Action: ['sqs:SendMessage'],
                                        Resource: [
                                            {
                                                'Fn::GetAtt': ['appSyncSqsQueue', 'Arn'],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            appsyncExampleTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    AttributeDefinitions: [
                        {
                            AttributeName: 'pk',
                            AttributeType: 'S',
                        },
                        {
                            AttributeName: 'sk',
                            AttributeType: 'S',
                        },
                        {
                            AttributeName: 'attr1',
                            AttributeType: 'S',
                        },
                        {
                            AttributeName: 'attr2',
                            AttributeType: 'S',
                        },
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'pk',
                            KeyType: 'HASH',
                        },
                        {
                            AttributeName: 'sk',
                            KeyType: 'RANGE',
                        },
                    ],
                    BillingMode: 'PAY_PER_REQUEST',
                    TableName: 'robAppsyncExampleDB',
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: 'GSI1',
                            KeySchema: [
                                {
                                    AttributeName: 'attr1',
                                    KeyType: 'HASH',
                                },
                                {
                                    AttributeName: 'pk',
                                    KeyType: 'RANGE',
                                },
                            ],
                            Projection: {
                                ProjectionType: 'ALL',
                            },
                        },
                        {
                            IndexName: 'GSI2',
                            KeySchema: [
                                {
                                    AttributeName: 'attr2',
                                    KeyType: 'HASH',
                                },
                                {
                                    AttributeName: 'pk',
                                    KeyType: 'RANGE',
                                },
                            ],
                            Projection: {
                                ProjectionType: 'ALL',
                            },
                        },
                    ],
                },
            },
            appSyncSqsQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    DelaySeconds: 0,
                    QueueName: 'robsAppSyncSQSQueue',
                    RedrivePolicy: {
                        deadLetterTargetArn: { 'Fn::GetAtt': ['appSyncSqsDeadLetterQueue', 'Arn'] },
                        maxReceiveCount: 3,
                    },
                    VisibilityTimeout: 60,
                },
            },
            appSyncSqsDeadLetterQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    DelaySeconds: 0,
                    MessageRetentionPeriod: 1209600, // 14 days
                    QueueName: 'robsAppSyncSQSDLQ',
                    VisibilityTimeout: 60,
                },
            },
        },
    },
    custom: {
        appSync: {
            name: 'robsAPI',
            authenticationType: 'API_KEY',
            schema: './src/schemas/screenshot.graphql',
            apiKeys: [{ name: 'robsKey', description: 'My api key', expiresAfter: '30d' }],
            mappingTemplatesLocation: resolve('src/resolvers'),
            mappingTemplates,
            functionConfigurationsLocation: resolve('src/resolvers'),
            functionConfigurations,
            dataSources,
            substitutions: {
                ...generateRegexList(regexes),
                regxCreativeUrl: '^[a-zA-Z]{1,10}$',
                propertyRequiredError: '{0} is a required property',
                propertyNotValidError: '{0} is not a valid {1} property',
            },
            logConfig: {
                level: 'ALL',
                excludeVerboseContent: false,
            },
        },
        defaultStage: 'local',
        stages: ['local', 'development', 'staging', 'production'],
        webpack: {
            webpackConfig: 'webpack.config.js',
            excludeFiles: 'src/**/*.spec.ts',
            includeModules: {
                forceExclude: ['aws-sdk'],
            },
        },
    },
};

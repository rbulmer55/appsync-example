module.exports = [
    {
        type: 'NONE',
        name: 'none',
    },
    {
        type: 'AMAZON_DYNAMODB',
        name: 'dynamodbDS',
        config: {
            tableName: {
                Ref: 'appsyncExampleTable',
            },
        },
    },
    {
        type: 'AWS_LAMBDA',
        name: 'receiverLambdaDS',
        config: { functionName: 'appSyncReceiver' },
    },
    {
        type: 'HTTP',
        name: 'sqsDSHTTP',
        config: {
            serviceRoleArn: { 'Fn::GetAtt': ['appSyncSQSRole', 'Arn'] },
            endpoint: 'https://eu-west-1.queue.amazonaws.com/',
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: '*',
                    Resource: '*',
                },
            ],
            authorizationConfig: {
                authorizationType: 'AWS_IAM',
                awsIamConfig: {
                    signingServiceName: 'sqs',
                    signingRegion: 'eu-west-1',
                },
            },
        },
    },
];

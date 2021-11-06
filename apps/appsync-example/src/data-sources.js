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
];

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
                Ref: 'appsyncExampletable',
            },
            region: '$self:provider.region',
        },
    },
];

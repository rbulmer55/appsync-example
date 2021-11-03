const { resolve } = require('path');

module.exports = [
    {
        dataSource: 'none',
        type: 'Query',
        kind: 'PIPELINE',
        field: 'getScreenshotStatus',
        functions: ['validateGenerateScreenshot'],
        request: resolve('src/resolvers/screenshot/pipelines/Before.generateScreenshots.req.vtl'),
        response: resolve('src/resolvers/screenshot/pipelines/After.generateScreenshots.res.vtl'),
    },
];

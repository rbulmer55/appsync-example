//const { resolve } = require('path');

module.exports = [
    {
        type: 'Mutation',
        kind: 'PIPELINE',
        field: 'downloadScreenshots',
        functions: ['validateGenerateScreenshot', 'recordScreenshotJob'],
        request: 'screenshot/pipelines/Before.generateScreenshots.req.vtl',
        response: 'shared/pipelines/After.each.res.vtl',
    },
    {
        type: 'Query',
        kind: 'PIPELINE',
        field: 'getScreenshotStatus',
        functions: ['getScreenshotStatus'],
        request: 'shared/pipelines/Before.each.req.vtl',
        response: 'shared/pipelines/After.each.res.vtl',
    },
];

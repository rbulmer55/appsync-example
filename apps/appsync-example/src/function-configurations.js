//const { resolve } = require('path');
module.exports = [
    {
        name: 'validateGenerateScreenshot',
        dataSource: 'none',
        request: 'screenshot/functions/Function.validateGenerateScreenshot.req.vtl',
        response: 'shared/functions/Function.sharedResponse.res.vtl',
    },
    {
        name: 'recordScreenshotJob',
        dataSource: 'dynamodbDS',
        request: 'screenshot/functions/Function.recordScreenshotJob.req.vtl',
        response: 'screenshot/functions/Function.recordScreenshotJob.res.vtl',
    },
    {
        name: 'getScreenshotStatus',
        dataSource: 'dynamodbDS',
        request: 'screenshot/functions/Function.getScreenshotStatus.req.vtl',
        response: 'screenshot/functions/Function.getScreenshotStatus.res.vtl',
    },
];

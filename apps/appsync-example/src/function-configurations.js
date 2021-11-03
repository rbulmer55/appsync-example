const { resolve } = require('path');
module.exports = [
    {
        name: 'validateGenerateScreenshot',
        dataSource: 'none',
        request: resolve('src/resolvers/screenshot/functions/Function.validateGenerateScreenshot.req.vtl'),
        response: resolve('src/resolvers/screenshot/functions/Function.validateGenerateScreenshot.res.vtl'),
    },
];

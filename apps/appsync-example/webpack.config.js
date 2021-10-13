const path = require('path');
const slsw = require('serverless-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: slsw.lib.entries,
    target: 'node',
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    node: {
        __dirname: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: '/node_modules/',
                options: {
                    transpileOnly: true,
                },
            },
        ],
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
        sourceMapFilename: "[name].js.map",
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
    ],
};

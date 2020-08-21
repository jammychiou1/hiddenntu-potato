const {merge} = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    plugins: [
        new webpack.DefinePlugin({
            API_HOST: JSON.stringify('https://API')
        })
    ]
});

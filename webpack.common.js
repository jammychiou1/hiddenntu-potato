const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js)$/,
                //exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env', '@babel/react']
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: { limit: 40000 }
                    },
                    'image-webpack-loader'
                ]
            }
        ]
    },
    entry: {
        index: ['@babel/polyfill', './src/index.js']
//        test: './src/test.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '河北馬鈴薯王',
            meta: {viewport: 'width=device-width, initial-scale=1, maximum-scale=1'}
        })
    ]
};

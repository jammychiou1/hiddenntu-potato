const {merge} = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    hot: true,
    host: '192.168.2.109',
    port: 9000,
    https: true
  },
  output: {
    filename: '[name].bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      API_HOST: JSON.stringify('https://192.168.2.109:8080')
    })
  ]
});

var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var env = process.env.WEBPACK_BUILD || 'development';

var paths = [
  '/'
];

module.exports = [
    new CopyWebpackPlugin([{ from: './docs/public/static', to: 'assets' }]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DllReferencePlugin({
      context: __dirname, // ָ��һ��·����Ϊ�����Ļ�������Ҫ��DllPlugin��context��������һ�£�����ͳһ����Ϊ��Ŀ��Ŀ¼
      manifest: require('./manifest.json'), // ָ��manifest.json
   }),
];

let path = require('path');
let webpack = require('webpack');
let env = process.env.WEBPACK_BUILD || 'development';
let nginx = 'http://10.10.10.201:1882';
// let nginx = 'http://192.168.8.228:1503';
let nginx1 = 'http://10.10.10.201:1503';

let outPutPath = path.resolve('build');
let config = [{
  devtool:'cheap-module-source-map',
  devServer: {
    contentBase: './build',
    historyApiFallback: true,
    stats: {
      chunks: false
    },
    proxy: {
      '/auth_s': {
        target: nginx,
        changeOrigin: true
      },

      '/xilaimanager_s': {
        target: nginx,
        changeOrigin: true
      },
      '/baomimanager_s': {
        target: nginx,
        changeOrigin: true
      },
      "/resume2_s": {
        target: nginx,
        changeOrigin: true
      },
      "/param_s": {
        target: nginx,
        changeOrigin: true
      },
      '/customer_s': {
        target: nginx1,
        changeOrigin: true
        },
    },
  },
  entry: {
    main:'./docs/lib/app',
    xilai:'./docs/xilai/main/app'
  },
  node: {
    fs: 'empty'
  },
  output: {
    path:'/' ,
    filename: '[name].js',
    publicPath: '/',
    chunkFilename: 'chunks/[name].chunk.js',
  },

  plugins: require('./plugin.config.js'),
  module: require('./module.config.js'),
  resolve: require('./resolve.config.js')
}];

module.exports = config;


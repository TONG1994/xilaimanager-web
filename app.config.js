const webpack = require('webpack');
let path = require('path');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  devtool: false,
  entry: {
    main: ['babel-polyfill', './docs/lib/app'],
    xilai: ['babel-polyfill', './docs/xilai/main/app']
  },
  
  node: {
    fs: 'empty'
  },
  
  output: {
    path:path.resolve(__dirname,'build') ,
    filename: '[name].[hash].js',
    publicPath: '/',
    chunkFilename: 'chunks/[name].chunk.js',
  },
  
  plugins: [
    new CopyWebpackPlugin([{from: './docs/public/static', to: 'assets'}]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // new ExtractTextPlugin('react_lz.css'),
    
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
      },
      mangle: true
    }),
    
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./manifest.json'),
    // }),
    new HtmlWebpackPlugin({
      inject: true,                 //在body底部插入 script
      template: 'docs/template.html',   //插入到哪个html下
      chunks: ['main'],			    //插入哪个js(跟entry对应)
      filename: "index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'docs/template.html',
      chunks: ['xilai'],
      filename: "xilai.html"
    })
  ],
  
  module: {
    loaders: [
      {
        test: /\.json$/,
        loaders: [
          'json-loader?cacheDirectory'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?cacheDirectory'
        ]
      },
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      // },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!sass-loader!postcss-loader'
      },
    ]
  },
  
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    alias:{
      '@': path.join(__dirname, 'docs')
    }
  },
  
};


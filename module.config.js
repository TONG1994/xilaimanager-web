let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
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
      test: /\.css$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader!postcss-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]'
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader!sass-loader!postcss-loader'
    },
    {
      test: /\.less$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader!less-loader!postcss-loader'
    },
    {
      	test: /\.jpg$/,
      	loader: 'file-loader'
    },
    {
      	test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      	loader: 'url-loader?limit=100000'
    }
  ]

};


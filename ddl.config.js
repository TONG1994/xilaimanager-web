const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// webpack --progress --colors --config ./ddl.config.js

const vendors = [
    'react',
    'react-dom',
    'react-router',
    'react-mixin',
    'react-helmet',
    'react-addons-transition-group',
    'bootstrap',
    'reactstrap',
    'reflux',
    'jquery',
    'antd',
    'promise',
    'holderjs',
    'bootstrap-css',
    'antd-css'
];

module.exports = {
	node: {
		fs: 'empty'
	},
    output: {
        path: 'build',
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        react_lz: vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        }),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': '"production"'
			}
		}),
	    new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('[name].css'), // ���css/less��ʱ����õ�ExtractTextPlugin
	    new webpack.optimize.UglifyJsPlugin({
	    	minimize: true,
			compress: {
				warnings: false,
			},
			mangle: true
	    })
    ],
	module: require('./module.config.js'), // ����ҵ������module����
	resolve: require('./resolve.config.js'), // ����ҵ������resolve����
};



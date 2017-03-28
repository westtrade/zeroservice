const webpack = require('webpack');

const mainBabelOptions = {
    plugins: ['transform-runtime'],
    presets: [
        // 'es2015',
		'stage-0',
		'airbnb',
    ],
    sourceMap: 'inline'
};


module.exports = {
	module: {
		rules: [
			// This is the development configuration.
			// It is focused on developer experience and fast rebuilds.
			{
				test: /\.json$/,
				loader: 'json-loader',
			},
			// Process JS with Babel (transpiles ES6 code into ES5 code).
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				exclude: /\/node_modules\//,
				options: mainBabelOptions,
			},
		],
	},
	externals: {
		// cheerio: 'window',
		// 'react-dom/server': 'window',
		cheerio: 'window',
		'react/addons': true,
		'react/lib/ExecutionEnvironment': true,
		'react/lib/ReactContext': true,
	},
	plugins: [
		// Conditional requires workaround
		// https://github.com/airbnb/enzyme/issues/47
		// https://github.com/airbnb/enzyme/blob/master/docs/guides/webpack.md
		// new webpack.IgnorePlugin(/react\/addons/),
		// new webpack.IgnorePlugin(/react\/lib\/ReactContext/),
		// new webpack.IgnorePlugin(/react\/lib\/ExecutionEnvironment/)
	],
	stats: 'errors-only',
};

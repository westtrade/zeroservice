
const mainBabelOptions = {
    plugins: ['transform-runtime'],
    presets: [
        'es2015',
		'stage-0',
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
				exclude: [/node_modules/],
				options: mainBabelOptions,
			},
		],
	},
	stats: 'errors-only',
};

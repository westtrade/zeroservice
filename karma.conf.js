// Karma configuration
// Generated on Thu Mar 09 2017 20:37:59 GMT+0300 (MSK)

const webpackConfig = require('./webpack.config');
const isparta = require('isparta');

module.exports = function karmaConfig(config) {
	config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [
			'mocha',
			'chai',
			// 'chai-as-promised',
			'sinon',
			'sinon-chai',
		],

        // list of files / patterns to load in the browser
		files: [
			// 'node_modules/jasmine-promises/dist/jasmine-promises.js',
            // 'node_modules/babel/browser-polyfill.js',
			'test/**/*.js',
		],

        // list of files to exclude
		exclude: [],

		plugins: [

			'karma-eslint',
			'karma-webpack',
			'karma-mocha',
			'karma-chai',
			'karma-sinon',
			'karma-sinon-chai',
			'karma-coverage',
			// 'karma-chai-as-promised',

			'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            // 'karma-firefox-launcher',
			'karma-html-detailed-reporter',
			'karma-coverage-istanbul-reporter',
			'karma-html-detailed-reporter',
            // 'karma-babel-preprocessor',
			'karma-log-reporter',
		],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'test/**/*.js': [
				// 'eslint', TODO Add eslint check
				'webpack',
			],
			'src/**/*.js': [
				'coverage',
				// 'eslint',
				// 'webpack'
			],
		},

		webpack: webpackConfig,
        // Optionally, configure the reporter
        // htmlDetailed: {
        // 	splitResults: true
        // },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: [
			'progress',
			'dots',
			'coverage',
            // 'verbose',
            // 'log-reporter',
            // 'coverage-istanbul',
            // 'htmlDetailed'
		],

		logReporter: {
			outputPath: '_reports/logs/',
            // default name is current directory
			logFileName: 'logfile.log',
            // default name is logFile_month_day_year_hr:min:sec.log
		},

		coverageReporter: {
			type: 'html',
			dir: 'coverage/',
			instrumenters: { isparta },
			// instrumenter: {
			// 	'src/**/*.js': 'isparta',
			// },
		},

		webpackMiddleware: {
			noInfo: true,
		},
        // any of these options are valid: https://github.com/istanbuljs/istanbul-api/blob/47b7803fbf7ca2fb4e4a15f3813a8884891ba272/lib/config.js#L33-L38
		// coverageIstanbulReporter: {
		//
        //     // reports can be any that are listed here: https://github.com/istanbuljs/istanbul-reports/tree/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib
		// 	reports: [
		// 		'html',
		// 		'lcovonly',
		// 		'text-summary',
		// 	],
		//
        //     // base output directory
		// 	dir: './coverage',
		//
        //     // if using webpack and pre-loaders, work around webpack breaking the source path
		// 	fixWebpackSourcePaths: true,
		//
        //     // Most reporters accept additional config options. You can pass
        //     // these through the `report-config` option
		// 	'report-config': {
		//
        //         // all options available at: https://github.com/istanbuljs/istanbul-reports/blob/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib/html/index.js#L135-L137
		// 		html: {
        //             // outputs the report in ./coverage/html
		// 			subdir: 'html',
		// 		},
		//
		// 	},
		//
        //     // enforce percentage thresholds
        //     // anything under these percentages will cause karma to fail with
        //     // an exit code of 1 if not running in watch mode
		// 	thresholds: {
		// 		statements: 100,
		// 		lines: 100,
		// 		branches: 100,
		// 		functions: 100,
		// 	},
		//
		// },

        // web server port
		port: 9876,

        // enable / disable colors in the output (reporters and logs)
		colors: true,

        // enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: [
			// 'Chromium',
			'PhantomJS',
            // 'Firefox'
		],

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
        // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // logLevel: config.LOG_INFO,
		logLevel: config.LOG_DEBUG,
		client: {
			captureConsole: true,
			chai: {
				includeStack: true,
			},
            // browserConsoleLogOptions: true,
            // mocha: {
            // 	bail: true
            // },
		},

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
		concurrency: Infinity,
	});
};

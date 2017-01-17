/**
 * Created by wlaw on 1/30/2017.
 */

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [{pattern: './bundles/in-memory-web-api.umd.js', watched: false}],
        exclude: [],
        //preprocessors: {'./test.ts': ['webpack']},

        reporters: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true
    });
};

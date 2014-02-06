module.exports	= function (karma) {
  karma.set({
    // base path, that will be used to resolve files and excludes.
    basePath: '../',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load into the browser.
    files: [
      'test/app/components/angular/*js',
      'test/app/components/angular-mocks/*js',
      'angular-flash.js',
      'test/specs/*.coffee'
    ],

    // list of files to exclude
    exclude: [ ],

    //Test results reporter to use.
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    preprocessors: {
      'test/specs/*.coffee': ['coffee']
    },

    // web server port
    port: 9876,

    // cli runner port
    runnerPort: 9100,

    // if true, it captures browsers runs tests then exits.
    singleRun: false,

    // enable / disable watching file and executing tests whenever any file changes.
    autoWatch: true,

    // enable/disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    // possible values: karma.LOG_DISABLE || karam.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
    logLevel: karma.LOG_INFO,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only MAC)
    // - PhantomJS
    // - IE (only Windows)
    browsers:['PhantomJS'],

    //If browser does not capture in given timeout [ms] kill it.
    captureTimeout: 6000,

    //Plugins to Load
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-coffee-preprocessor'
    ]

  });
};

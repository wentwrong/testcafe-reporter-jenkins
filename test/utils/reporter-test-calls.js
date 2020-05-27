var TestRunErrorFormattableAdapter = require('testcafe').embeddingUtils.TestRunErrorFormattableAdapter;
var UncaughtErrorOnPage            = require('testcafe').embeddingUtils.testRunErrors.UncaughtErrorOnPage;
var ActionElementNotFoundError     = require('testcafe').embeddingUtils.testRunErrors.ActionElementNotFoundError;
var testCallsite                   = require('./test-callsite');


function makeErrors (errDescrs) {
    return errDescrs.map(function (descr) {
        return new TestRunErrorFormattableAdapter(descr.err, descr.metaInfo);
    });
}

module.exports = [
    {
        method: 'reportTaskStart',
        args:   [
            new Date('1970-01-01T00:00:00.000Z'),
            [
                'Chrome 83.0.4103.61 / Linux 0.0',
                'Firefox 76.0 / Linux 0.0'
            ],
            7,
            // NOTE: testStructure
            [
                {
                    fixture: {
                        id:    'fid1',
                        name:  'First fixture',
                        tests: [
                            {
                                id:   'idf1t1',
                                name: 'First test in first fixture',
                                skip: false
                            },
                            {
                                id:   'idf1t2',
                                name: 'Second test in first fixture',
                                skip: false,
                            },
                            {
                                id:   'idf1t3',
                                name: 'Third test in first fixture',
                                skip: false
                            }
                        ]
                    }
                },
                {
                    fixture: {
                        id:    'fid2',
                        name:  'Second fixture',
                        tests: [
                            {
                                id:   'idf2t1',
                                name: 'First test in second fixture',
                                skip: true
                            },
                            {
                                id:   'idf2t2',
                                name: 'Second test in second fixture',
                                skip: false,
                            },
                            {
                                id:   'idf2t3',
                                name: 'Third test in second fixture',
                                skip: false
                            }
                        ]
                    }
                },
                {
                    fixture: {
                        id:    'fid3',
                        name:  'Third fixture',
                        tests: [
                            {
                                id:   'idf3t1',
                                name: 'First test in third fixture',
                                skip: false
                            }
                        ]
                    }
                }
            ],
            // NOTE: task properties
            {
                configuration: {
                    allowMultipleWindows: false,
                    appInitDelay:         1000,
                    assertionTimeout:     3000,
                    browsers:             ['chrome', 'firefox'],
                    concurrency:          1,
                    debugMode:            false,
                    debugOnFail:          false,
                    developmentMode:      false,
                    disablePageCaching:   false,
                    disablePageReloads:   false,
                    disableScreenshots:   false,
                    hostname:             'localhost',
                    pageLoadTimeout:      3000,
                    port1:                1337,
                    port2:                1338,
                    quarantineMode:       false,
                    reporter:             [{ name: 'jenkins' }],
                    retryTestPages:       false,
                    screenshots:          {
                        path:        '/screenshots',
                        takeOnFails: true,
                        pathPattern: '${TEST_INDEX}/${USERAGENT}/${FILE_INDEX}.png'
                    },
                    selectorTimeout:        10000,
                    skipJsErrors:           false,
                    skipUncaughtErrors:     false,
                    speed:                  1,
                    src:                    ['fixtures/**/*'],
                    stopOnFirstFail:        false,
                    takeScreenshotsOnFails: true,
                    videoPath:              '/videos',
                    videoOptions:           {
                        failedOnly:  true,
                        pathPattern: '${TEST_INDEX}/${USERAGENT}/${FILE_INDEX}.mp4',
                        ffmpegPath:  '/usr/bin/ffmpeg'
                    }
                }
            }
        ]
    },
    {
        method: 'reportFixtureStart',
        args:   [
            'First fixture',
            './fixture1.js'
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'First test in first fixture',
            {
                errs:           [],
                warnings:       [],
                durationMs:     10271,
                unstable:       false,
                screenshotPath: '/screenshots/1',
                screenshots:    [
                    {
                        testRunId:         't1f1_1',
                        screenshotPath:    '/screenshots/1/Firefox_76.0_Linux_0.0/1.png',
                        thumbnailPath:     '/screenshots/1/Firefox_76.0_Linux_0.0/thumbnails/1.png',
                        userAgent:         'Firefox_76.0_Linux_0.0',
                        quarantineAttempt: null,
                        takenOnFail:       false
                    },
                    {
                        testRunId:         't1f1_2',
                        screenshotPath:    '/screenshots/1/Chrome_83.0.4103.61_Linux_0.0/1.png',
                        thumbnailPath:     '/screenshots/1/Chrome_83.0.4103.61_Linux_0.0/thumbnails/1.png',
                        userAgent:         'Chrome_83.0.4103.61_Linux_0.0',
                        quarantineAttempt: null,
                        takenOnFail:       false
                    }
                ],
                videos:     [],
                quarantine: null,
                skipped:    false
            }
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'Second test in first fixture',
            {
                errs: makeErrors([
                    {

                        err: new UncaughtErrorOnPage('Some error', 'http://example.org'),

                        metaInfo: {
                            userAgent:      'Chrome 83.0.4103.61 / Linux 0.0',
                            screenshotPath: '/screenshots/1445437598847/errors',
                            callsite:       testCallsite,
                            testRunPhase:   'inTest'
                        }
                    },
                    {
                        err: new ActionElementNotFoundError({ apiFnChain: ['one', 'two', 'three'], apiFnIndex: 1 }),

                        metaInfo: {
                            userAgent:    'Firefox 76.0 / Linux 0.0',
                            callsite:     testCallsite,
                            testRunPhase: 'inTest'
                        }
                    }
                ]),
                warnings:       [],
                durationMs:     5871,
                unstable:       false,
                screenshotPath: '/screenshots/2',
                screenshots:    [
                    {
                        testRunId:         'idf1t2_1',
                        screenshotPath:    '/screenshots/2/Firefox_76.0_Linux_0.0/errors/1.png',
                        thumbnailPath:     '/screenshots/2/Firefox_76.0_Linux_0.0/errors/thumbnails/1.png',
                        userAgent:         'Firefox_76.0_Linux_0.0',
                        quarantineAttempt: null,
                        takenOnFail:       true
                    },
                    {
                        testRunId:         'idf1t2_2',
                        screenshotPath:    '/screenshots/2/Chrome_83.0.4103.61_Linux_0.0/errors/1.png',
                        thumbnailPath:     '/screenshots/2/Chrome_83.0.4103.61_Linux_0.0/errors/thumbnails/1.png',
                        userAgent:         'Chrome_83.0.4103.61_Linux_0.0',
                        quarantineAttempt: null,
                        takenOnFail:       true
                    }
                ],
                videos: [
                    {
                        testRunId:  'idf1t2_1',
                        videoPath:  '/videos/2/Firefox_76.0_Linux_0.0/1.mp4',
                        singleFile: false
                    },
                    {
                        testRunId:  'idf1t2_2',
                        videoPath:  '/videos/2/Chrome_83.0.4103.61_Linux_0.0/1.mp4',
                        singleFile: false
                    }
                ],
                quarantine: null,
                skipped:    false
            }
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'Third test in first fixture',
            {
                errs:           [],
                warnings:       [],
                durationMs:     3564,
                unstable:       false,
                screenshotPath: null,
                screenshots:    [],
                videos:         [],
                quarantine:     null,
                skipped:        false
            }
        ]
    },
    {
        method: 'reportFixtureStart',
        args:   [
            'Second fixture',
            './fixture2.js'
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'First test in second fixture',
            {
                errs:           [],
                warnings:       [],
                durationMs:     74000,
                unstable:       false,
                screenshotPath: null,
                screenshots:    [],
                videos:         [],
                quarantine:     null,
                skipped:        true
            }
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'Second test in second fixture',
            {
                errs:           [],
                warnings:       [],
                durationMs:     3596,
                unstable:       false,
                screenshotPath: null,
                screenshots:    [],
                videos:         [],
                quarantine:     null,
                skipped:        false
            }
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'Third test in second fixture',
            {
                errs:           [],
                warnings:       [],
                durationMs:     4526,
                unstable:       false,
                screenshotPath: null,
                screenshots:    [],
                videos:         [],
                quarantine:     null,
                skipped:        false
            }
        ]
    },
    {
        method: 'reportFixtureStart',
        args:   [
            'Third fixture',
            './fixture3.js'
        ]
    },
    {
        method: 'reportTestDone',
        args:   [
            'First test in third fixture',
            {
                errs: makeErrors([
                    {
                        err: new ActionElementNotFoundError({ apiFnChain: ['one', 'two', 'three'], apiFnIndex: 1 }),

                        metaInfo: {
                            userAgent:    'Firefox 76.0 / Linux 0.0',
                            callsite:     testCallsite,
                            testRunPhase: 'inFixtureBeforeEachHook'
                        }
                    }
                ]),
                warnings:       [],
                durationMs:     6557,
                unstable:       false,
                screenshotPath: '/screenshots/7',
                screenshots:    [
                    {
                        testRunId:         'f3t1',
                        screenshotPath:    '/screenshots/7/Firefox_76.0_Linux_0.0/errors/1.png',
                        thumbnailPath:     '/screenshots/7/Firefox_76.0_Linux_0.0/errors/thumbnails/1.png',
                        userAgent:         'Firefox_76.0_Linux_0.0',
                        quarantineAttempt: null,
                        takenOnFail:       true
                    }
                ],
                videos: [
                    {
                        testRunId:  'f3t1',
                        videoPath:  '/videos/7/Firefox_76.0_Linux_0.0/1.mp4',
                        singleFile: false
                    }
                ],
                quarantine: null,
                skipped:    false
            }
        ]
    },
    {
        method: 'reportTaskDone',
        args:   [
            new Date('1970-01-01T00:15:25.000Z'),
            4,
            [
                'Was unable to take a screenshot due to an error.\n\nReferenceError: someVar is not defined',
                'Was unable to take a screenshot due to an error.\n\nReferenceError: someOtherVar is not defined'
            ],
            {
                failedCount:  2,
                passedCount:  4,
                skippedCount: 1
            }
        ]
    }
];

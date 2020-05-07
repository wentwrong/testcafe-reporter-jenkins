import { v4 as uuidv4 } from 'uuid';

export default function () {
    return {
        noColors:           true,
        report:             '',
        startTime:          null,
        uaList:             null,
        currentFixtureName: null,
        testCount:          0,
        singleVideoHash:    null,

        async reportTaskStart (startTime, userAgents, testCount) {
            this.startTime = startTime;
            this.uaList    = userAgents.join(', ');
            this.testCount = testCount;
        },

        async reportFixtureStart (name) {
            this.currentFixtureName = this.escapeHtml(name);
        },

        _renderErrors (errs) {
            this.report += this.indentString('<failure>\n', 4);
            this.report += this.indentString('<![CDATA[', 4);

            errs.forEach((err, idx) => {
                err = this.formatError(err, `${idx + 1}) `);

                this.report += '\n';
                this.report += this.indentString(err, 6);
                this.report += '\n';
            });

            this.report += this.indentString(']]>\n', 4);
            this.report += this.indentString('</failure>\n', 4);
        },

        _renderAttachments (testRunInfo, hasScreenshots, hasVideos) {
            this.report += this.indentString('<system-out>\n', 4);
            this.report += this.indentString('<![CDATA[\n', 4);

            if (hasScreenshots) {
                for (const screenshot of testRunInfo.screenshots)
                    this.report += this.indentString(`[[ATTACHMENT|${screenshot.screenshotPath}|${uuidv4()}]]\n`, 6);
            }

            if (hasVideos) {
                for (const video of testRunInfo.videos) {
                    if (video.singleFile)
                        this.singleVideoHash = this.singleVideoHash || uuidv4();

                    const videoHash = video.singleFile ? this.singleVideoHash : uuidv4();

                    this.report += this.indentString(`[[ATTACHMENT|${video.videoPath}|${videoHash}]]\n`, 6);
                }
            }

            this.report += this.indentString(']]>\n', 4);
            this.report += this.indentString('</system-out>\n', 4);
        },

        async reportTestDone (name, testRunInfo) {
            const hasErr = !!testRunInfo.errs.length;
            const hasScreenshots = testRunInfo.screenshots && !!testRunInfo.screenshots.length;
            const hasVideos = testRunInfo.videos && !!testRunInfo.videos.length;

            name = this.escapeHtml(name);

            const openTag = `<testcase classname="${this.currentFixtureName}" ` +
                            `name="${name}" time="${testRunInfo.durationMs / 1000}">\n`;

            this.report += this.indentString(openTag, 2);

            if (testRunInfo.skipped)
                this.report += this.indentString('<skipped/>\n', 4);

            else if (hasErr)
                this._renderErrors(testRunInfo.errs);

            if (hasScreenshots || hasVideos)
                this._renderAttachments(testRunInfo, hasScreenshots, hasVideos);

            this.report += this.indentString('</testcase>\n', 2);
        },

        _renderWarnings (warnings) {
            this.setIndent(2)
                .write('<system-out>')
                .newline()
                .write('<![CDATA[')
                .newline()
                .setIndent(4)
                .write(`Warnings (${warnings.length}):`)
                .newline();

            warnings.forEach(msg => {
                this.setIndent(4)
                    .write('--')
                    .newline()
                    .setIndent(0)
                    .write(this.indentString(msg, 6))
                    .newline();
            });

            this.setIndent(2)
                .write(']]>')
                .newline()
                .write('</system-out>')
                .newline();
        },

        async reportTaskDone (endTime, passed, warnings, result) {
            const name     = `TestCafe Tests: ${this.escapeHtml(this.uaList)}`;
            const time     = (endTime - this.startTime) / 1000;

            this.write('<?xml version="1.0" encoding="UTF-8" ?>')
                .newline()
                .write(`<testsuite name="${name}" tests="${this.testCount}" failures="${result.failedCount}" ` +
                       `skipped="${result.skippedCount}" time="${time}" ` +
                       `timestamp="${endTime.toUTCString()}" id="${uuidv4()}">`)
                .newline()
                .write(this.report);

            if (warnings.length)
                this._renderWarnings(warnings);

            this.setIndent(0)
                .write('</testsuite>');
        }
    };
}

module.exports = function () {
    return {
        noColors:           true,
        report:             '',
        startTime:          null,
        uaList:             null,
        currentFixtureName: null,
        testCount:          0,
        skipped:            0,

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
                console.log(err);

                this.report += '\n';
                this.report += this.indentString(err, 6);
                this.report += '\n';
            });

            this.report += this.indentString(']]>\n', 4);
            this.report += this.indentString('</failure>\n', 4);
        },

        _renderAttachments (testRunInfo) {
            this.report += this.indentString('<system-out>\n', 4);
            this.report += this.indentString('<![CDATA[\n', 4);

            if (testRunInfo.screenshots && testRunInfo.screenshot.length) {
                for (const screenshot of testRunInfo.screenshots)
                    this.report += this.indentString(`[[ATTACHMENT|${screenshot.screenshotPath}]]\n`, 6);
            }

            if (testRunInfo.videos && testRunInfo.videos.length) {
                for (const video of testRunInfo.videos)
                    this.report += this.indentString(`[[ATTACHMENT|${video.videoPath}]]\n`, 6);
            }

            this.report += this.indentString(']]>\n', 4);
            this.report += this.indentString('</system-out>\n', 4);
        },

        async reportTestDone (name, testRunInfo) {
            var hasErr = !!testRunInfo.errs.length;

            name = this.escapeHtml(name);

            var openTag = `<testcase classname="${this.currentFixtureName}" ` +
                          `name="${name}" time="${testRunInfo.durationMs / 1000}">\n`;

            this.report += this.indentString(openTag, 2);

            if (testRunInfo.skipped) {
                this.skipped++;
                this.report += this.indentString('<skipped/>\n', 4);
            }
            else if (hasErr)
                this._renderErrors(testRunInfo.errs);

            if (testRunInfo.screenshots && testRunInfo.screenshots.length ||
                testRunInfo.videos && testRunInfo.videos.length)
                this._renderAttachments(testRunInfo);

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

        async reportTaskDone (endTime, passed, warnings) {
            var name     = `TestCafe Tests: ${this.escapeHtml(this.uaList)}`;
            var failures = this.testCount - passed;
            var time     = (endTime - this.startTime) / 1000;

            this.write('<?xml version="1.0" encoding="UTF-8" ?>')
                .newline()
                .write(`<testsuite name="${name}" tests="${this.testCount}" failures="${failures}" skipped="${this.skipped}"` +
                       ` errors="${failures}" time="${time}" timestamp="${endTime.toUTCString()}" >`)
                .newline()
                .write(this.report);

            if (warnings.length)
                this._renderWarnings(warnings);

            this.setIndent(0)
                .write('</testsuite>');
        }
    };
};

var buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin;
var pluginFactory       = require('../../lib');
var reporterTestCalls   = require('./reporter-test-calls');

module.exports = async function createReport (withColors) {
    const outStream = {
        data: '',

        write: function (text) {
            this.data += text;
        }
    };

    const plugin = buildReporterPlugin(pluginFactory, outStream);

    plugin.chalk.enabled = !plugin.noColors && withColors;

    // NOTE: disable errors coloring
    // because errors rendering is done by TestCafe
    // and can be changed regardless of the plugin state
    if (plugin.chalk.enabled) {
        const origFormatError = plugin.formatError;

        plugin.formatError = function () {
            plugin.chalk.enabled = false;

            const result = origFormatError.apply(plugin, arguments);

            plugin.chalk.enabled = true;

            return result;
        };
    }

    for (const call of reporterTestCalls)
        await plugin[call.method].apply(plugin, call.args);

    // NOTE: mock stack entries
    outStream.data = outStream.data.replace(/\(.+:\d+:\d+.*\)/g, '(some-file:1:1)');

    // NOTE: mock attachments UUID hashes
    outStream.data = outStream.data.replace(/\[\[(.*)\|(.*)\|(.*)\]\]/g, '[[$1|$2|UUID]]');

    // NOTE: mock suite UUID hash
    outStream.data = outStream.data.replace(/id="(.*)"/g, 'id="UUID"');

    return outStream.data;
};

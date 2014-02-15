/**
 * @module grunt
 */


"use strict";

var request = require("request"),
    util = require("../util"),
    pluginList;

/**
 * Check whether plugin with the specified name is existent.
 * 
 * Data about found plugins will be passed into callback as array.
 * If no plugin is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the plugin to check.
 * @param {Function} callback
 *      Function that should be called to process operation's result.
 * @param {Object} [settings]
 *      Operation settings.
 *      The following settings are supported (name - type - description):
        <ul>
        <li><code>caseSensitive</code> - <code>Boolean</code> - Whether case-sensitive search should be used
        <li><code>partialMatch</code> - <code>Integer</code> - Allow partial matching: 0 - disallow (by default), 
            1 - allow at the beginning of matching strings, 2 - allow substring matching
        <li><code>limit</code> - <code>Integer</code> - Limit of quantity of results
        </ul>
 */
exports.detect = function detect(name, callback, settings) {
    var result = [],
        nI, nL, nLimit, plugin, sName;
    if (pluginList && pluginList.length) {
        nLimit = util.getLimit(settings);
        for (nI = 0, nL = pluginList.length; nI < nL; nI++) {
            plugin = pluginList[nI];
            sName = plugin.name;
            if (sName.indexOf("grunt-") === 0) {
                sName = plugin.name = sName.substring(6);
            }
            if ( util.isStringMatch(sName, name, settings) ) {
                plugin.description = plugin.ds;
                delete plugin.ds;
                plugin.url = "https://npmjs.org/package/grunt-" + sName;
                result.push(plugin);
                if (result.length === nLimit) {
                    break;
                }
            }
        }
        callback(null, result);
    }
    else {
        request("http://gruntjs.com/plugin-list.json?_=" + new Date().getTime(), function(err, response, data) {
            if (! err && response.statusCode === 200) {
                pluginList = JSON.parse(data).aaData;
                detect(name, callback, settings);
            }
            else {
                callback(err, result);
            }
        });
    }
};

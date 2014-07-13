/**
 * Module that provides means to check/search in {@link http://gulpjs.com/plugins/ registry of Gulp plugins}.
 * 
 * @module gulp
 */


"use strict";

var request = require("request"),
    util = require("../util"),
    pluginList;

function extractField(plugin, sField, sName) {
    var list;
    if ((sField in plugin) && Array.isArray(list = plugin[sField]) && list.length) {
        plugin[sName || sField] = list[0];
    }
    return extractField;
}

/**
 * Check whether plugin with the specified name is existent, or make search for the specified string.
 * 
 * Data about found plugins will be passed into callback as array.
 * If no plugin is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the plugin to check or string to search for.
 * @param {Function} callback
 *      Function that should be called to process operation's result.
 * @param {Object} [settings]
 *      Operation settings.
 *      The following settings are supported (name - type - description):
        <ul>
        <li><code>caseSensitive</code> - <code>Boolean</code> - Whether case-sensitive check/search should be used
        <li><code>partialMatch</code> - <code>Integer</code> - Allow partial matching when checking name: 
            0 - disallow (by default), 1 - allow at the beginning of matching strings, 2 - allow substring matching
        <li><code>search</code> - <code>Boolean</code> - Whether search should be made instead of check
        <li><code>limit</code> - <code>Integer</code> - Limit of quantity of results
        </ul>
 */
exports.detect = function detect(name, callback, settings) {
    var result = [],
        bRealSearch, nI, nL, nLimit, plugin, sName;
    if (pluginList && pluginList.length) {
        bRealSearch = util.isRealSearchSet(settings);
        nLimit = util.getLimit(settings);
        for (nI = 0, nL = pluginList.length; nI < nL; nI++) {
            plugin = pluginList[nI];
            sName = plugin.name;
            if ( util.isStringMatch(bRealSearch ? [sName, plugin.description || ""].concat(plugin.keywords) : sName, 
                                    name, settings) ) {
                result.push(plugin);
                if (result.length === nLimit) {
                    break;
                }
            }
        }
        callback(null, result);
    }
    else {
        request("http://registry.gulpjs.com/_search?fields=author,description,homepage,keywords,license,name,repository,version&q=keywords:gulpplugin,gulpfriendly&from=0&size=100000", function(err, response, data) {
            if (! err && response.statusCode === 200) {
                pluginList = JSON.parse(data).hits.hits;
                for (nI = 0, nL = pluginList.length; nI < nL; nI++) {
                    plugin = pluginList[nI].fields;
                    extractField(plugin, "author")
                                (plugin, "description")
                                (plugin, "homepage", "url")
                                (plugin, "license")
                                (plugin, "name")
                                (plugin, "repository")
                                (plugin, "version");
                    delete plugin.homepage;
                    sName = plugin.name;
                    plugin.fullname = sName;
                    if (sName.indexOf("gulp-") === 0) {
                        plugin.name = sName.substring(5);
                    }
                    pluginList[nI] = plugin;
                }
                detect(name, callback, settings);
            }
            else {
                callback(err, result);
            }
        });
    }
};

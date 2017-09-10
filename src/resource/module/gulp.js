/**
 * Module that provides means to check/search in {@link http://gulpjs.com/plugins/ registry of Gulp plugins}.
 * 
 * @module gulp
 */


"use strict";

var request = require("request"),
    mixing = require("mixing"),
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
 * Convert received plugin's data to normalized form.
 *
 * @param {Object} plugin
 *      Source data.
 * @return {Object}
 *      Normalized data.
 */
exports.preparePlugin = function preparePlugin(plugin) {
    var sItemName;

    extractField(plugin, "author")
                (plugin, "description")
                (plugin, "homepage", "url")
                (plugin, "name")
                (plugin, "repository")
                (plugin, "version");
    delete plugin.homepage;
    sItemName = plugin.name;
    plugin.fullname = sItemName;
    if (sItemName.indexOf("gulp-") === 0) {
        plugin.name = sItemName.substring(5);
    }

    return plugin;
};

function detectWithList(list, name, callback, settings) {
    var bRealSearch = util.isRealSearchSet(settings),
        nL = list.length,
        nLimit = util.getLimit(settings),
        result = [],
        nI, plugin, sName;
    for (nI = 0; nI < nL; nI++) {
        plugin = list[nI];
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
        <li><code>requestTimeout</code> - <code>Integer</code> - Number of milliseconds to wait for a response before aborting a data request
        </ul>
 */
exports.detect = function detect(name, callback, settings) {
    var result = [],
        sRequestUrl = "https://npmsearch.com/query?fields=name,keywords,repository,description,author,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&sort=rating:desc&size=10000&start=",
        requestSettings = util.getRequestSettings(settings),
        taskList = [],
        tempPluginList;
    
    function handler(err, response, data) {
        /*jshint boss:true*/
        var bRun, itemList, nI, nL, preparePlugin;
        if (! err && response.statusCode === 200) {
            preparePlugin = exports.preparePlugin;
            itemList = data.results;
            for (nI = 0, nL = itemList.length; nI < nL; nI++) {
                tempPluginList.push(preparePlugin(itemList[nI]));
            }
            nL = tempPluginList.length;
            if (nL > 0) {
                if (nL < data.total) {
                    request(mixing({url: sRequestUrl + nL}, requestSettings), handler);
                }
                else {
                    pluginList = tempPluginList;
                    bRun = true;
                }
            }
        }
        else if (! tempPluginList.length) {
            callback(new util.getHttpRequestError(err, response), result);
        }
        else {
            bRun = true;
        }
        if (bRun) {
            for (nI = 0, nL = taskList.length; nI < nL; nI++) {
                detectWithList.apply(null, [tempPluginList].concat(taskList[nI]));
            }
        }
    }
    
    if (pluginList && pluginList.length) {
        detectWithList(pluginList, name, callback, settings);
    }
    else {
        taskList.push(Array.prototype.slice.call(arguments));
        if (! tempPluginList) {
            tempPluginList = [];
            request(mixing({url: sRequestUrl + 0}, requestSettings), handler);
        }
    }
};

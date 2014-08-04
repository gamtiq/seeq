/**
 * Module that provides means to check/search in {@link http://spmjs.io SPM}.
 * 
 * @module spm
 */


"use strict";

var eva = require("eva"),
    request = require("request"),
    util = require("../util"),
    callbackList, detectList, packageList;

/**
 * Check whether package with the specified name is existent, or make search for the specified string.
 * 
 * Data about found packages will be passed into callback as array.
 * If no package is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the package to check or string to search for.
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
        bRealSearch, nI, nL, nLimit, pkg, sName;
    if (packageList && packageList.length) {
        bRealSearch = util.isRealSearchSet(settings);
        nLimit = util.getLimit(settings);
        for (nI = 0, nL = packageList.length; nI < nL; nI++) {
            pkg = packageList[nI];
            sName = pkg.name;
            if ( util.isStringMatch(bRealSearch ? [sName, pkg.description || ""].concat(pkg.keywords || []) : sName, 
                                    name, settings) ) {
                if (! pkg.url && pkg.homepage) {
                    pkg.url = pkg.homepage;
                }
                result.push(pkg);
                if (result.length === nLimit) {
                    break;
                }
            }
        }
        callback(null, result);
    }
    else if (detectList) {
        detectList.push(eva.closure(detect, arguments));
        callbackList.push(callback);
    }
    else {
        detectList = [eva.closure(detect, arguments)];
        callbackList = [callback];
        request("http://spmjs.io/repositories", function(err, response, data) {
            var fallbackList = callbackList,
                taskList = detectList;
            detectList = null;
            callbackList = null;
            if (! err && response.statusCode === 200) {
                packageList = JSON.parse(data).data.results;
                eva.map(taskList);
            }
            else {
                eva.map(fallbackList,
                        function getParamList() {
                            return [util.getHttpRequestError(err, response), []];
                        });
            }
        });
    }
};

/**
 * Removes cached package list.
 */
exports.clearCache = function() {
    packageList = null;
};

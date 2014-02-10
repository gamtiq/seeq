/**
 * @module component
 */


"use strict";

var component = require("component"),
    util = require("../util");

/**
 * Check whether package with the specified name is existent.
 * 
 * Data about found packages will be passed into callback as array.
 * If no package is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the package to check.
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
exports.detect = function(name, callback, settings) {
    component.search(name, function(err, resultList) {
        var nI, nL, nLimit, pkg, result;
        if (err) {
            callback(err, []);
        }
        else {
            result = [];
            nLimit = util.getLimit(settings);
            for (nI = 0, nL = resultList.length; nI < nL; nI++) {
                pkg = resultList[nI];
                if ( util.isStringMatch(pkg.name, name, settings) ) {
                    pkg.url = "https://github.com/" + pkg.repo;
                    pkg.repo = pkg.url + ".git";
                    result.push(pkg);
                    if (result.length === nLimit) {
                        break;
                    }
                }
            }
            callback(null, result);
        }
    });
};

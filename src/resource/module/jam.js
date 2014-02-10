/**
 * @module jam
 */


"use strict";

require("jamjs");

var repository = require("jamjs/lib/repository"),
    repositoryUrl = require("jamjs/lib/jamrc").DEFAULTS.repositories[0],
    mixing = require("mixing"),
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
    
    function resultCallback(err, data) {
        var result = [],
            nI, nL, pkg, version;
        if (data) {
            if (bSearch) {
                data = data.rows;
            }
            else {
                data = [data];
            }
            for (nI = 0, nL = data.length; nI < nL; nI++) {
                pkg = data[nI];
                if (bSearch) {
                    pkg = pkg.doc;
                }
                if ( util.isStringMatch(pkg.name, name, settings) ) {
                    result.push(pkg);
                    if (pkg.tags && (version = pkg.tags.latest) && (version = pkg.versions[version])) {
                        mixing(pkg, version);
                    }
                    if (result.length === nLimit) {
                        break;
                    }
                }
            }
        }
        callback(err, result);
    }
    
    var bSearch = util.isSearchSet(settings),
        nLimit = util.getLimit(settings, 100);
    if (bSearch) {
        repository.search(repositoryUrl, name, nLimit < 50 ? 100 : nLimit * 2, resultCallback);
    }
    else {
        repository.get(repositoryUrl, name, resultCallback);
    }
};

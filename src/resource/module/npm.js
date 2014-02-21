/**
 * @module npm
 */


"use strict";

var npm = require("npm"),
    util = require("../util"),
    bReady = false;

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
    if (bReady) {
        var bSearch = util.isSearchSet(settings);
        npm.commands[bSearch ? "search" : "view"]([name], true, function(err, data) {
            var result = [],
                bRealSearch, nLimit, pkg, sName;
            if (data) {
                if (bSearch) {
                    bRealSearch = util.isRealSearchSet(settings);
                    nLimit = util.getLimit(settings);
                    for (sName in data) {
                        pkg = data[sName];
                        if ( bRealSearch || util.isStringMatch(pkg.name, name, settings) ) {
                            if (! pkg.url) {
                                pkg.url = "https://npmjs.org/package/" + sName;
                            }
                            if (pkg.keywords && ! Array.isArray(pkg.keywords)) {
                                pkg.keywords = [pkg.keywords];
                            }
                            result.push(pkg);
                            if (result.length === nLimit) {
                                break;
                            }
                        }
                    }
                }
                else {
                    for (sName in data) {
                        result.push(data[sName]);
                        break;
                    }
                }
            }
            if (err && err.code === "E404") {
                err = null;
            }
            callback(err, result);
        });
    }
    else {
        npm.load({loglevel: "silent"}, function(err, npmObj) {
            if (err) {
                callback(err, []);
            }
            else {
                bReady = true;
                npm = npmObj;
                detect(name, callback, settings);
            }
        });
    }
};

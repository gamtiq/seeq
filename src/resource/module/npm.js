/**
 * @module npm
 */


"use strict";

var npm = require("npm"),
    util = require("../util"),
    bReady = false;

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
exports.detect = function detect(name, callback, settings) {
    if (bReady) {
        var bSearch = util.isSearchSet(settings);
        npm.commands[bSearch ? "search" : "view"]([name], true, function(err, data) {
            var nLimit = util.getLimit(settings),
                result = [],
                pkg, sName;
            if (data) {
                if (bSearch) {
                    for (sName in data) {
                        pkg = data[sName];
                        if ( util.isStringMatch(pkg.name, name, settings) ) {
                            if (! pkg.url) {
                                pkg.url = "https://npmjs.org/package/" + sName;
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

/**
 * Module that provides means to check/search in {@link https://npmjs.org NPM}.
 * 
 * @module npm
 */


"use strict";

var exec = require("child_process").exec,
    path = require("path"),
    util = require("../util");

/**
 * Check whether package with the specified name is existent, or make search for the specified string.
 * 
 * Data about found packages will be passed into callback as array.
 * If no package is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the package to check or string to search for.
 * @param {Function} callback
 *      Function that should be called to process operation"s result.
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
    /*jshint laxbreak:true*/
    var bSearch = util.isSearchSet(settings);
    var nLimit = util.getLimit(settings, -1);
    exec("npm " + (bSearch ? "search" : "view") + " " + name + " --json"
            + (bSearch
                ? " --searchlimit=" + (nLimit > -1 ? nLimit : 100000)
                : ""),
        {cwd: path.join(__dirname, "../../../node_modules/.bin")},
        function(error, stdout) {
            var result = [],
                bRealSearch, data, nI, nK, pkg, sName;
            if (error) {
                sName = error.message;
                if (error.code === "E404"
                        || sName.indexOf("ERR! code E404") > -1
                        || sName.indexOf("Registry returned 404") > -1) {
                    error = null;
                }
            }
            else if (stdout) {
                try {
                    data = JSON.parse(stdout);
                }
                catch (e) {
                    error = e;
                }
                if (data) {
                    if (bSearch) {
                        bRealSearch = util.isRealSearchSet(settings);
                        for (nI = 0, nK = data.length; nI < nK; nI++) {
                            pkg = data[nI];
                            sName = pkg.name;
                            if ( util.isStringMatch(bRealSearch
                                                        ? [sName, pkg.description || ""].concat(pkg.keywords || [])
                                                        : sName,
                                                    name, settings) ) {
                                if (! pkg.url) {
                                    pkg.url = "https://npmjs.org/package/" + pkg.name;
                                }
                                if (pkg.keywords && ! Array.isArray(pkg.keywords)) {
                                    pkg.keywords = [pkg.keywords];
                                }
                                result.push(pkg);
                            }
                        }
                    }
                    else {
                        if (! data.url && data.homepage) {
                            data.url = data.homepage;
                        }
                        result.push(data);
                    }
                }
            }
            callback(error, result);
        });
};

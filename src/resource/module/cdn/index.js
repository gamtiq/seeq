/**
 * Module that provides means to check/search in supported CDNs.
 * 
 * @module cdn
 */


"use strict";

var request = require("request"),
    util = require("../../util"),
    packageMap = {};

// Make search in packages of specified CDN
function search(name, callback, settings) {
    var bRealSearch = util.isRealSearchSet(settings),
        nLimit = util.getLimit(settings),
        packageList = packageMap[settings.cdn.toLowerCase()],
        nL = packageList.length,
        result = [],
        nI, pkg, sName;
    
    for (nI = 0; nI < nL; nI++) {
        pkg = packageList[nI];
        sName = pkg.name;
        if ( util.isStringMatch(bRealSearch ? [sName, pkg.description || ""] : sName, 
                                name, settings) ) {
            pkg.version = pkg.lastversion;
            pkg.url = pkg.homepage || pkg.github || "";
            result.push(pkg);
            if (result.length === nLimit) {
                break;
            }
        }
    }
    callback(null, result);
}


/**
 * List of supported CDNs.
 */
exports.supportedCdn = ["cdnjs", "jsdelivr"];

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
 * @param {Object} settings
 *      Operation settings.
 *      The following settings are supported (name - type - description):
        <ul>
        <li><code>cdn</code> - <code>String</code> - CDN in which check/search should be made:
            <code>cdnjs</code> or <code>jsdelivr</code> (case-insensitive)
        <li><code>caseSensitive</code> - <code>Boolean</code> - Whether case-sensitive check/search should be used
        <li><code>partialMatch</code> - <code>Integer</code> - Allow partial matching when checking name: 
            0 - disallow (by default), 1 - allow at the beginning of matching strings, 2 - allow substring matching
        <li><code>search</code> - <code>Boolean</code> - Whether search should be made instead of check
        <li><code>limit</code> - <code>Integer</code> - Limit of quantity of results
        </ul>
        The only mandatory setting is <code>cdn</code>.
 */
exports.detect = function(name, callback, settings) {
    var sCdn;
    if (settings && settings.cdn) {
        sCdn = settings.cdn.toLowerCase();
        if (exports.supportedCdn.indexOf(sCdn) > -1) {
            if (packageMap[sCdn]) {
                search(name, callback, settings);
            }
            else {
                request("http://api.jsdelivr.com/v1/" + sCdn + "/libraries", function(err, response, data) {
                    if (! err && response.statusCode === 200) {
                        packageMap[sCdn] = JSON.parse(data);
                        search(name, callback, settings);
                    }
                    else {
                        callback(err, []);
                    }
                });
            }
        }
        else {
            callback(new Error("'" + sCdn + "' CDN is not supported"), []);
        }
    }
    else {
        callback(new Error("CDN is not specified"), []);
    }
};

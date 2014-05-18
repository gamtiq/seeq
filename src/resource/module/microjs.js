/**
 * Module that provides means to check/search in {@link http://microjs.com MicroJS}.
 * 
 * @module microjs
 */


"use strict";

var request = require("request"),
    util = require("../util"),
    libraryList;

/**
 * Check whether library with the specified name is existent, or make search for the specified string.
 * 
 * Data about found libraries will be passed into callback as array.
 * If no library is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the library to check or string to search for.
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
        bRealSearch, nI, nL, nLimit, library, sName;
    if (libraryList && libraryList.length) {
        bRealSearch = util.isRealSearchSet(settings);
        nLimit = util.getLimit(settings);
        for (nI = 0, nL = libraryList.length; nI < nL; nI++) {
            library = libraryList[nI];
            sName = library.name;
            if (! library.keywords) {
                library.keywords = library.tags;
                delete library.tags;
            }
            if ( util.isStringMatch(bRealSearch ? [sName, library.description].concat(library.keywords) : sName, 
                                    name, settings) ) {
                library.stars = Number(library.ghwatchers);
                delete library.ghwatchers;
                result.push(library);
                if (result.length === nLimit) {
                    break;
                }
            }
        }
        callback(null, result);
    }
    else {
        request("http://microjs.com/data-min.js", function(err, response, data) {
            if (! err && response.statusCode === 200) {
                nI = data.indexOf("[");
                nL = data.lastIndexOf("]");
                if (nI > -1 && nL > nI) {
                    libraryList = JSON.parse(data.substring(nI, nL + 1));
                    detect(name, callback, settings);
                }
                else {
                    callback("Incorrect format of data about list of libraries", result);
                }
            }
            else {
                callback(err, result);
            }
        });
    }
};

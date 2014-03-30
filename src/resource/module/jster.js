/**
 * Module that provides means to check/search in {@link http://jster.net JSter}.
 * 
 * @module jster
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
            if ( util.isStringMatch(bRealSearch ? [sName, library.description] : sName, 
                                    name, settings) ) {
                if (library.github) {
                    library.repository = library.github + ".git";
                    if (! library.homepage) {
                        library.homepage = library.github;
                    }
                }
                result.push(library);
                if (result.length === nLimit) {
                    break;
                }
            }
        }
        callback(null, result);
    }
    else {
        request("http://api.jster.net/v1/libraries", function(err, response, data) {
            if (! err && response.statusCode === 200) {
                libraryList = JSON.parse(data);
                detect(name, callback, settings);
            }
            else {
                callback(err, result);
            }
        });
    }
};

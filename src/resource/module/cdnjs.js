/**
 * Module that provides means to check/search in {@link http://cdnjs.com/ CDNJS}.
 * 
 * @module cdnjs
 */


"use strict";

var request = require("request"),
    util = require("../util"),
    libraryList;

/**
 * Convert received library data to normalized form.
 *
 * @param {Object} data
 *      Source data.
 * @return {Object}
 *      Normalized data.
 */
exports.prepareData = function prepareData(data) {
    var value;
    if ((value = data.repository) && typeof value === "object" && typeof value.url === "string") {
        data.repository = data.repository.url;
    }
    if ((value = data.license) && typeof value === "object" && typeof value.name === "string") {
        data.license = data.license.name;
    }
    data.url = data.homepage || "";

    return data;
};

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
        <li><code>requestTimeout</code> - <code>Integer</code> - Number of milliseconds to wait for a response before aborting a data request
        </ul>
 */
exports.detect = function detect(name, callback, settings) {
    var result = [],
        taskList = [],
        bRealSearch, nI, nL, nLimit, library, prepareData, requestSettings, sName;
    if (libraryList && libraryList.length) {
        bRealSearch = util.isRealSearchSet(settings);
        nLimit = util.getLimit(settings);
        prepareData = exports.prepareData;
        for (nI = 0, nL = libraryList.length; nI < nL; nI++) {
            library = libraryList[nI];
            sName = library.name;
            if ( util.isStringMatch(bRealSearch ? [sName, library.description].concat(library.keywords) : sName, 
                                    name, settings) ) {
                result.push(prepareData(library));
                if (result.length === nLimit) {
                    break;
                }
            }
        }
        callback(null, result);
    }
    else {
        if (! taskList.length) {
            requestSettings = util.getRequestSettings(settings);
            requestSettings.url = "https://api.cdnjs.com/libraries?fields=version,description,homepage,keywords,license,repository";
            request(requestSettings, function(err, response, data) {
                if (! err && response.statusCode === 200) {
                    libraryList = data.results;
                    for (nI = 0, nL = taskList.length; nI < nL; nI++) {
                        detect.apply(null, taskList[nI]);
                    }
                }
                else {
                    callback(new util.getHttpRequestError(err, response), result);
                }
            });
        }
        taskList.push(Array.prototype.slice.call(arguments));
    }
};

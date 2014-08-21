/**
 * Module that provides means to check/search in {@link http://customelements.io Custom Elements gallery}.
 * 
 * @module customelements
 */


"use strict";

var eva = require("eva"),
    request = require("request"),
    util = require("../util"),
    callbackList, componentList, detectList;

/**
 * Check whether component with the specified name is existent, or make search for the specified string.
 * 
 * Data about found components will be passed into callback as array.
 * If no component is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the component to check or string to search for.
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
        bRealSearch, nI, nL, nLimit, component, sName;
    if (componentList && componentList.length) {
        bRealSearch = util.isRealSearchSet(settings);
        nLimit = util.getLimit(settings);
        for (nI = 0, nL = componentList.length; nI < nL; nI++) {
            component = componentList[nI];
            sName = component.name;
            if ( util.isStringMatch(bRealSearch ? [sName, component.description || ""].concat(component.keywords || []) : sName, 
                                    name, settings) ) {
                result.push(component);
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
        request("http://customelementsio.herokuapp.com", function(err, response, data) {
            var fallbackList = callbackList,
                taskList = detectList;
            detectList = null;
            callbackList = null;
            if (! err && response.statusCode === 200) {
                nI = data.indexOf("[");
                nL = data.lastIndexOf("]");
                if (nI > -1 && nL > nI) {
                    try {
                        componentList = JSON.parse(data.substring(nI, nL + 1));
                    }
                    catch (e) {
                        nI = -1;
                    }
                    if (nI > -1) {
                        eva.map(taskList);
                    }
                }
                else {
                    nI = -1;
                }
                if (nI === -1) {
                    eva.map(fallbackList,
                            function getParamList() {
                                return [
                                            new util.IncorrectResponseError(data, 
                                                                            "Incorrect format of data about list of components"), 
                                            []
                                        ];
                            });
                }
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
 * Removes cached component list.
 */
exports.clearCache = function() {
    componentList = null;
};

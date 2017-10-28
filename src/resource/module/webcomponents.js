/**
 * Module that provides means to check/search in {@link https://www.webcomponents.org Web components gallery}.
 * 
 * @module webcomponents
 */


"use strict";

var request = require("request"),
    mixing = require("mixing"),
    util = require("../util");

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
        <li><code>requestTimeout</code> - <code>Integer</code> - Number of milliseconds to wait for a response before aborting a data request
        </ul>
 */
exports.detect = function detect(name, callback, settings) {
    /*jshint laxbreak:true*/
    var bRealSearch = util.isRealSearchSet(settings),
        bSearch = util.isSearchSet(settings),
        nLimit = bRealSearch || (settings && settings.partialMatch)
                    ? util.getLimit(settings)
                    : 1,
        result = [],
        sRequestUrl = "https://www.webcomponents.org/api/search/" + name + "?limit=100&count=",
        requestSettings = util.getRequestSettings(settings);

    function handler(err, response, data) {
        /*jshint boss:true*/
        var item, itemList, nI, nL, sItemName, value;
        if (! err && response.statusCode === 200) {
            if (data.count) {
                itemList = data.results;
                for (nI = 0, nL = itemList.length; nI < nL; nI++) {
                    item = itemList[nI];
                    sItemName = item.repo;
                    if ( util.isStringMatch(bRealSearch ? [sItemName, item.description || ""] : sItemName,
                                            name, settings) ) {
                        item.name = sItemName;
                        item.url = "https://github.com/" + item.owner + "/" + sItemName;
                        item.repository = item.url;
                        if (value = item.version.match(/\d+\.\d+(\.\d+)?/)) {
                            item.version = value[0];
                        }
                        result.push(item);
                    }
                    if (result.length === nLimit) {
                        break;
                    }
                }
                if (bSearch && result.length < nLimit && data.cursor) {
                    request(mixing({url: sRequestUrl + "&cursor=" + data.cursor}, requestSettings), handler);
                }
                else {
                    callback(null, result);
                }
            }
            else {
                callback(null, result);
            }
        }
        else {
            callback(new util.getHttpRequestError(err, response), result);
        }
    }

    request(mixing({url: sRequestUrl}, requestSettings), handler);
};

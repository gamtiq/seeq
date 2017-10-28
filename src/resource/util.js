/**
 * Helper functions.
 * 
 * @module resource/util
 */

var he = require("he"),
    util = require("util");

/**
 * Decode HTML entities in given string.
 * 
 * @param {String} str
 *      String that should be processed.
 * @return {String}
 *      Decoded string.
 */
exports.decodeHtmlEntity = function(str) {
    return he.decode(str);
};

/**
 * Return value of <code>limit</code> setting.
 * 
 * Default value will be returned if <code>limit</code> field is not present in <code>settings</code> parameter.
 * 
 * @param {Object} [settings]
 *      Operation settings. The object can have numeric <code>limit</code> field which value will be returned
 *      if the value is positive number and not greater than maximum value.
 *      Otherwise value of <code>defaultValue</code> parameter will be returned.
 * @param {Number} [defaultValue]
 *      Default value of limit. <code>maxValue</code> is used when parameter value is not passed or 0.
 * @param {Number} [maxValue]
 *      Maximum value of limit. <code>Number.MAX_VALUE</code> is used when parameter value is not passed.
 * @return {Number}
 *      Value that corresponds to <code>limit</code> setting.
 */
exports.getLimit = function(settings, defaultValue, maxValue) {
    /*jshint laxbreak:true*/
    var nLimit = settings ? settings.limit : null;
    if (! maxValue) {
        maxValue = Number.MAX_VALUE;
    }
    return typeof nLimit === "number" && nLimit > 0 && nLimit <= maxValue
            ? nLimit
            : defaultValue || maxValue;
};

/**
 * Return request settings.
 * 
 * @param {Object} [settings]
 *      Operation settings.
 *      The following settings are used to form request settings (name - type - description):
        <ul>
        <li><code>requestTimeout</code> - <code>Integer</code> - Number of milliseconds to wait for a response before aborting a data request
        </ul>
 * @param {Boolean} [json=true]
 *      Whether the setting to process response as JSON should be added.
 * @return {Object}
 *      Request settings.
 */
exports.getRequestSettings = function(settings, json) {
    var requestSettings = {};
    
    if (settings && settings.requestTimeout) {
        requestSettings.timeout = settings.requestTimeout;
    }
    if (json || arguments.length < 2) {
        requestSettings.json = true;
    }

    return requestSettings;
};

/**
 * Determine whether search should be made instead of check according to operation settings.
 * 
 * @param {Object} [settings]
 *      Operation settings.
 *      The following settings are used to specify real search (name - type - description):
        <ul>
        <li><code>search</code> - <code>Boolean</code> - Whether search should be made instead of check
        </ul>
 * @return {Boolean}
 *      <code>true</code> if real search should be made according to settings,
 *      <code>false</code> otherwise.
 */
exports.isRealSearchSet = function(settings) {
    return Boolean( settings && settings.search );
};

/**
 * Check whether search should be made according to operation settings.
 * 
 * @param {Object} [settings]
 *      Operation settings.
 *      The following settings are used to specify search (name - type - description):
        <ul>
        <li><code>caseSensitive</code> - <code>Boolean</code> - Whether case-sensitive check/search should be used
        <li><code>partialMatch</code> - <code>Integer</code> - Allow partial matching: 0 - disallow (by default), 
            1 - allow at the beginning of matching strings, 2 - allow substring matching
        <li><code>search</code> - <code>Boolean</code> - Whether search should be made instead of check
        </ul>
 * @return {Boolean}
 *      <code>true</code> if search should be made according to settings,
 *      <code>false</code> otherwise.
 */
exports.isSearchSet = function(settings) {
    return Boolean( settings && (settings.caseSensitive || settings.partialMatch || settings.search) );
};

/**
 * Check whether one of given strings is similar to the searched string.
 * 
 * @param {Array | String} value
 *      String or array of strings that should be checked.
 * @param {String} searchValue
 *      Value that is searched for.
 * @param {Object} [settings]
 *      Operation settings.
 *      The following settings are supported (name - type - description):
        <ul>
        <li><code>caseSensitive</code> - <code>Boolean</code> - Whether case-sensitive check should be used
        <li><code>partialMatch</code> - <code>Integer</code> - Allow partial matching: 0 - disallow (by default), 
            1 - allow at the beginning of matching strings, 2 - allow substring matching
        <li><code>search</code> - <code>Boolean</code> - Whether search should be made instead of check
        </ul>
 * @return {Boolean}
 *      <code>true</code> if one of given strings is similar to the searched string according to settings,
 *      <code>false</code> otherwise.
 */
exports.isStringMatch = function(value, searchValue, settings) {
    /*jshint laxbreak:true*/
    if (! Array.isArray(value)) {
        value = [value];
    }
    if (! settings) {
        settings = {};
    }
    
    var bInsensitive = ! settings.caseSensitive,
        nPartMatch = "partialMatch" in settings 
                        ? settings.partialMatch 
                        : (settings.search ? 2 : 0),
        nL = value.length,
        item, nI, nP;
    
    if (bInsensitive) {
        searchValue = searchValue.toLowerCase();
    }
    for (nI = 0; nI < nL; nI++) {
        item = value[nI];
        if (bInsensitive) {
            item = item.toLowerCase();
        }
        if ((! nPartMatch && item === searchValue) 
                || (nPartMatch && (nP = item.indexOf(searchValue)) > -1 && (nPartMatch > 1 || nP === 0))) {
            return true;
        }
    }
    return false;
};

/**
 * Class for errors of failed HTTP requests.
 * 
 * @param {http.IncomingMessage} response
 *      Represents data about response.
 * @param {String} [message]
 *      Error message.
 * @constructor
 */
function FailedHttpRequestError(response, message) {
    Error.call(this, message || "Http request failed");
    this.response = response;
}
util.inherits(FailedHttpRequestError, Error);

exports.FailedHttpRequestError = FailedHttpRequestError;

/**
 * Class for errors of incorrect response data.
 * 
 * @param {String} responseData
 *      Received response data.
 * @param {String} [message]
 *      Error message.
 * @constructor
 */
function IncorrectResponseError(responseData, message) {
    Error.call(this, message || "Incorrect response data");
    this.responseData = responseData;
}
util.inherits(IncorrectResponseError, Error);

exports.IncorrectResponseError = IncorrectResponseError;

/**
 * Return object that represents data about error of HTTP request.
 * <br>
 * If <code>err</code> parameter is set then it will be returned.
 * Otherwise instance of {@link resource/util.FailedHttpRequestError FailedHttpRequestError} will be returned.
 * 
 * @param {Error} err
 *      Represents data about error.
 * @param {http.IncomingMessage} response
 *      Represents data about response.
 * @return {Error}
 *      Error object.
 */
exports.getHttpRequestError = function(err, response) {
    /*jshint laxbreak:true*/
    return err
            ? err
            : new FailedHttpRequestError(response);
};

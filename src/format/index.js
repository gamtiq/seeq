/**
 * API to work with formatters that can be used to format result of {@link module:seeq.search search}.
 * <br>
 * Each formatter is a function that should return string representing result of search.
 * The following parameters are passed to the format function:
   <ul>
   <li>object that is result of {@link module:seeq.search search}
   <li>object that represents format settings; the following settings can be used (name - type - description):
       <ul>
       <li><code>queryList</code> - <code>Array</code> - list of names/strings that were checked/searched
       <li><code>verbose</code> - <code>boolean</code> - whether basic or detailed result should be returned
       </ul>
   </ul>
 * 
 * @module format
 */


"use strict";

var formatMap = {};


/**
 * Format result of search by using specified formatter.
 * 
 * @param {Object} data
 *      Result of {@link module:seeq.search search}.
 * @param {String} name
 *      Name of formatter that should be used.
 * @param {Object} [settings]
 *      Format settings. Default values for settings are the following:
        <ul>
        <li><code>queryList</code> - extracted from <code>data</code> parameter
        <li><code>verbose</code> - <code>false</code>
        </ul>
 * @return {String}
 *      Result returned by specified formatter or empty string if no one of formatters has the specified name.
 * @alias module:format.format
 */
function format(data, name, settings) {
    var fmt = formatMap[name];
    if (! settings) {
        settings = {};
    }
    if (! settings.queryList) {
        settings.queryList = Object.keys(data);
    }
    else if (! Array.isArray(settings.queryList)) {
        settings.queryList = [settings.queryList];
    }
    if (! ("verbose" in settings)) {
        settings.verbose = false;
    }
    return fmt ? fmt(data, settings) : "";
}

/**
 * Return formatter with specified name.
 * 
 * @param {String} name
 *      Name of formatter that should be returned.
 * @return {Function | null}
 *      Function that represents formatter
 *      or <code>null</code> if no one of formatters has the specified name.
 * @alias module:format.get
 */
function get(name) {
    return formatMap[name] || null;
}

/**
 * Check whether formatter with specified name exists.
 * 
 * @param {String} name
 *      Name that should be checked.
 * @return {Boolean}
 *      <code>true</code> if there is a formatter with the specified name,
 *      <code>false</code> if no one of formatters has the specified name.
 * @alias module:format.exists
 * @see {@link module:format.get get}
 */
function exists(name) {
    return get(name) !== null;
}

/**
 * Return object that represents all available formatters.
 * 
 * @return {Object}
 *      Object that represents all available formatters.
 *      Fields are names of formatters, values are corresponding formatters.
 * @alias module:format.getMap
 */
function getMap() {
    return formatMap;
}

/**
 * Return list containing names of all available formatters.
 * 
 * @return {Array}
 *      List containing names of all available formatters.
 * @alias module:format.getNameList
 */
function getNameList() {
    var result = [],
        sName;
    for (sName in formatMap) {
        result.push(sName);
    }
    return result;
}

/**
 * Set formatter with specified name.
 * 
 * @param {String} name
 *      Name of formatter.
 * @param {Function | null} format
 *      Function that represents formatter.
 * @return {Object}
 *      Object that represents module <code>exports</code>.
 * @throws Will throw an error if format is not a function.
 * @alias module:format.set
 */
function set(name, format) {
    /*jshint newcap:false*/
    if (typeof format !== "function") {
        throw Error("Format should be a function");
    }
    formatMap[name] = format;
    return exports;
}

/**
 * Remove formatter with specified name.
 * 
 * @param {String} name
 *      Name of formatter.
 * @return {Function | null}
 *      Function that represents formatter
 *      or <code>null</code> if no one of formatters has the specified name.
 * @alias module:format.remove
 */
function remove(name) {
    var format = formatMap[name] || null;
    if (format) {
        delete formatMap[name];
    }
    return format;
}

// Set predefined formatters
set("text", require("./text"));
set("json", require("./json"));
set("raw", require("./raw"));

//Exports

exports.format = format;
exports.get = get;
exports.exists = exists;
exports.getMap = getMap;
exports.getNameList = getNameList;
exports.set = set;
exports.remove = remove;

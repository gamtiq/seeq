/*
 * seeq
 * https://github.com/gamtiq/seeq
 *
 * Copyright (c) 2014 Denis Sikuler
 * Licensed under the MIT license.
 */


/**
 * Utility to detect whether a name is registered or present on some resource.
 * 
 * @module seeq
 */


"use strict";

var mixing = require("mixing"),
    resourceLib = require("./resource");


function getCheckNameCallback(resource, position, callback) {
    return function(err, result) {
        callback(err, result, resource, position);
    };
}

/**
 * Check existence of name on specified resources.
 * 
 * Result of checking will be passed into callback as object.
 * Each field of the object is name of resource that was checked.
 * Value of result's field is object with the following fields (name - type - description):
   <ul>
   <li><code>name</code> - <code>String</code> - resource name
   <li><code>description</code> - <code>String</code> - resource description
   <li><code>url</code> - <code>String</code> - URL of resource
   <li><code>query</code> - <code>String</code> - name that was checked
   <li><code>result</code> - <code>Array</code> - result that was received from resource; 
           each item in the array is object that represents data about found name
   <li><code>error</code> - <code>Object | String</code> - error that was got while checking resource;
           this field is present only when there was an error
   </ul>
 * 
 * <code>null</code> will be passed into callback when the name is not given and resources with specified names are not found.
 * 
 * @param {String} name
 *      The name that should be checked.
 * @param {Function} callback
 *      Function that should be called to process operation's result.
 * @param {Object} [settings]
 *      Operation settings. The following settings are supported (name - type - description):
        <ul>
        <li><code>progressCallback</code> - <code>Function</code> - function that should be called after getting result
                from each resource; object with the following fields will be passed into callback:
                <ul>
                <li><code>name</code> - <code>String</code> - name that was checked
                <li><code>resource</code> - <code>String</code> - resource that was checked
                <li><code>result</code> - <code>Object</code> - result of checking (see above)
                <li><code>number</code> - <code>Integer</code> - index number of checking
                <li><code>total</code> - <code>Integer</code> - total number of checks
                </ul>
        <li><code>resource</code> - <code>Array | String</code> - list of names of resources or name of resource (case-insensitive)
                that should be checked; if setting's value is not specified, all resources will be checked
        <li><code>settings</code> - <code>Object</code> - settings for resources usage;
                fields are resource identifiers, values are objects representing settings for the corresponding resources
        </ul>
 * @alias module:seeq.checkName
 */
function checkName(name, callback, settings) {
    
    // Gather results from resources
    function resultCallback(err, result, resource, position) {
        /*jshint boss:true*/
        var sResourceName = resource.name,
            item, nI, nK, resultMap;
        nC--;
        item = resultList[position] = {
            name: sResourceName,
            description: resource.description,
            url: resource.url,
            query: name,
            result: result
        };
        if (err) {
            item.error = err;
        }
        if (settings.progressCallback) {
            settings.progressCallback({
                name: name,
                resource: sResourceName,
                result: item,
                number: nTotal - nC,
                total: nTotal
            });
        }
        if (nC === 0) {
            // Form result
            resultMap = {};
            for (nI = 0, nK = resultList.length; nI < nK; nI++) {
                if (resource = resultList[nI]) {
                    resultMap[resource.name] = resource;
                }
            }
            callback(resultMap);
        }
    }
    
    var resultList = [],
        nC, nI, nTotal, resource, resourceList, resourceSettings;
    if (! settings) {
        settings = {};
    }
    resourceSettings = settings.settings || {};
    resourceList = resourceLib.getList({selectResource: settings.resource, includeApi: true});
    if (name && (nC = resourceList.length)) {
        // Request data from resources
        for (nI = 0, nTotal = nC; nI < nTotal; nI++) {
            resource = resourceList[nI];
            resource.api.detect(name, getCheckNameCallback(resource, nI, resultCallback), resourceSettings[resource.id]);
        }
    }
    else {
        callback(null);
    }
}


/**
 * Check existence of each name from the list on specified resources.
 * 
 * Result of checking will be passed into callback as object.
 * Each field of the object is a name that was checked.
 * Value of result's field is object that is returned by {@link module:seeq.checkName checkName} function.
 * 
 * <code>null</code> will be passed into callback when no name is specified to check.
 * 
 * @param {Array | String} names
 *      The list of names or a name that should be checked.
 * @param {Function} callback
 *      Function that should be called to process operation's result.
 * @param {Object} [settings]
 *      Operation settings. See {@link module:seeq.checkName checkName} for details.
 * @alias module:seeq.check
 */
function check(names, callback, settings) {
    /*jshint boss:true*/
    
    // Notify about operation progress
    function checkNameProgress(data) {
        data.number += data.total * nI;
        data.total *= nK;
        progressCallback(data);
    }
    
    // Gather results for each name
    function resultCallback(result) {
        resultMap[ names[nI] ] = result;
        nI++;
        if (nI < nK) {
            // Get results for the next name
            checkName(names[nI], resultCallback, settings);
        }
        else {
            // Return collected data
            callback(resultMap);
        }
    }
    
    var progressCallback = settings && settings.progressCallback,
        resultMap = {},
        nI, nK;
    
    if (names && typeof names === "string") {
        names = [names];
    }
    if (names && (nK = names.length)) {
        if (progressCallback) {
            settings = mixing({progressCallback: checkNameProgress}, settings, {except: "progressCallback"});
        }
        // Get results for the first name
        checkName(names[nI = 0], resultCallback, settings);
    }
    else {
        callback(null);
    }
}


// Exports

exports.check = check;
exports.checkName = checkName;

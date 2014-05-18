/**
 * Module that provides formatter to return raw JSON result of {@link module:seeq.search search}.
 * 
 * @module raw
 */


"use strict";

/**
 * Return raw JSON result of {@link module:seeq.search search}.
 * 
 * @param {Object} data
 *      Result of {@link module:seeq.search search}.
 * @param {Object} settings
 *      Format settings. See {@link module:format format} for details.
 * @return {String}
 *      JSON representing result of search.
 * @see {@link module:format format}
 */
module.exports = function(data, settings) {
    /*jshint boss:true*/
    var bVerbose = settings.verbose,
        queryList = settings.queryList,
        out = {},
        item, nameMap, nameResult, nI, nK, sName, sResourceName, resourceResult, value;
    
    for (nI = 0, nK = queryList.length; nI < nK; nI++) {
        sName = queryList[nI];
        nameResult = data[sName];
        if (nameResult && typeof nameResult === "object") {
            out[sName] = nameMap = {};
            for (sResourceName in nameResult) {
                resourceResult = nameResult[sResourceName];
                if (bVerbose) {
                    nameMap[sResourceName] = resourceResult;
                }
                else {
                    nameMap[sResourceName] = item = {
                        result: resourceResult.result
                    };
                    if (value = resourceResult.error) {
                        item.error = value;
                    }
                }
            }
        }
    }
    return JSON.stringify(out, null, 4);
};

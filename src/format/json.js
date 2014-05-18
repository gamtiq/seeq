/**
 * Module that provides formatter to convert result of {@link module:seeq.search search} into JSON.
 * 
 * @module json
 */


"use strict";

var util = require("./util");

/**
 * Format/convert result of {@link module:seeq.search search} into JSON.
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
    var getLicenseList = util.getLicenseList,
        getRepository = util.getRepository,
        bVerbose = settings.verbose,
        queryList = settings.queryList,
        out = {},
        item, nameMap, nameResult, nI, nK, nN, nQ, sName, sResourceName, resourceResult, resourceResultList, 
        result, resultList, value;
    
    for (nI = 0, nK = queryList.length; nI < nK; nI++) {
        sName = queryList[nI];
        nameResult = data[sName];
        if (nameResult && typeof nameResult === "object") {
            out[sName] = nameMap = {};
            for (sResourceName in nameResult) {
                nameMap[sResourceName] = item = {};
                item.result = resultList = [];
                resourceResult = nameResult[sResourceName];
                resourceResultList = resourceResult.result;
                nQ = resourceResultList.length;
                if (nQ) {
                    for (nN = 0; nN < nQ; nN++) {
                        result = resourceResultList[nN];
                        item = {
                            name: result.name
                        };
                        if (value = result.description) {
                            item.description = value;
                        }
                        if (value = result.url) {
                            item.url = value;
                        }
                        if ((value = result.keywords) && value.length) {
                            item.keywords = value;
                        }
                        
                        if (bVerbose) {
                            if (value = result.version) {
                                item.version = value;
                            }
                            if (value = getRepository(result)) {
                                item.repository = value;
                            }
                            if (value = result.language) {
                                item.language = value;
                            }
                            if ((value = getLicenseList(result)) && value.length) {
                                item.license = value;
                            }
                            if (value = result.stars) {
                                item.stars = value;
                            }
                        }
                        resultList.push(item);
                    }
                }
                else if (value = resourceResult.error) {
                    item.error = value;
                }
            }
        }
    }
    return JSON.stringify(out, null, 4);
};

/**
 * Module that provides formatter to convert result of {@link module:seeq.search search} into plain text.
 * 
 * @module text
 */


"use strict";

var sEol = require("os").EOL,
    util = require("./util");

/**
 * Format/convert result of {@link module:seeq.search search} into plain text.
 * 
 * @param {Object} data
 *      Result of {@link module:seeq.search search}.
 * @param {Object} settings
 *      Format settings. See {@link module:format format} for details.
 * @return {String}
 *      Text representing result of search.
 * @see {@link module:format format}
 */
module.exports = function(data, settings) {
    /*jshint expr:true*/
    var getLicenseList = util.getLicenseList,
        getRepository = util.getRepository,
        bVerbose = settings.verbose,
        queryList = settings.queryList,
        out = [],
        sEolTwice = sEol + sEol,
        sIndent = "    ",
        sIndentTwice = "        ",
        nameResult, nI, nK, nN, nQ, sName, sResourceName, resourceResult, resourceResultList, result, value;
    
    for (nI = 0, nK = queryList.length; nI < nK; nI++) {
        sName = queryList[nI];
        nameResult = data[sName];
        if (nameResult && typeof nameResult === "object") {
            nI &&
                out.push(sEolTwice);
            out.push(nI + 1, ". ", sName);
            for (sResourceName in nameResult) {
                out.push(sEolTwice, sIndent, sResourceName);
                resourceResult = nameResult[sResourceName];
                resourceResultList = resourceResult.result;
                nQ = resourceResultList.length;
                if (nQ) {
                    out.push(" - ", nQ);
                    for (nN = 0; nN < nQ; nN++) {
                        result = resourceResultList[nN];
                        nN &&
                            out.push(sEol);
                        
                        out.push(sEol, sIndentTwice, result.name);
                        result.description &&
                            out.push(" - ", result.description);
                        (value = result.url) &&
                            out.push(sEol, sIndentTwice, "url: ", value);
                        (value = result.keywords) && value.length &&
                            out.push(sEol, sIndentTwice, "keywords: ", value.join(" "));
                        
                        if (bVerbose) {
                            result.version &&
                                out.push(sEol, sIndentTwice, "version: ", result.version);
                            (value = getRepository(result)) &&
                                out.push(sEol, sIndentTwice, "repository: ", value);
                            result.language &&
                                out.push(sEol, sIndentTwice, "language: ", result.language);
                            (value = getLicenseList(result)) && value.length &&
                                out.push(sEol, sIndentTwice, "license: ", value.join(", "));
                            result.stars &&
                                out.push(sEol, sIndentTwice, "stars: ", result.stars);
                        }
                    }
                }
                else {
                    out.push(sEol, sIndentTwice, sName, " is not found.");
                    resourceResult.error &&
                        out.push(sEol, sIndentTwice, "Error of checking '", sName, "' at '", sResourceName, "': ", resourceResult.error);
                }
            }
        }
    }
    return out.join("");
};

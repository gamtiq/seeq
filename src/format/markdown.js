/**
 * Module that provides formatter to convert result of {@link module:seeq.search search} 
 * into {@link http://daringfireball.net/projects/markdown/ Markdown}.
 * 
 * @module markdown
 */


"use strict";

var sEol = require("os").EOL,
    util = require("./util");

/**
 * Format/convert result of {@link module:seeq.search search} into {@link http://daringfireball.net/projects/markdown/ Markdown}.
 * 
 * @param {Object} data
 *      Result of {@link module:seeq.search search}.
 * @param {Object} settings
 *      Format settings. See {@link module:format format} for details.
 * @return {String}
 *      Markdown text representing result of search.
 * @see {@link module:format format}
 */
module.exports = function(data, settings) {
    /*jshint boss:true, expr:true*/
    var getLicenseList = util.getLicenseList,
        getRepository = util.getRepository,
        bVerbose = settings.verbose,
        queryList = settings.queryList,
        out = [],
        sBr = "  " + sEol,
        sIndent = "    ",
        sIndentTwice = "        ",
        nameResult, nI, nK, nN, nQ, sName, sResourceName, resourceResult, resourceResultList, result, value;
    
    for (nI = 0, nK = queryList.length; nI < nK; nI++) {
        sName = queryList[nI];
        nameResult = data[sName];
        if (nameResult && typeof nameResult === "object") {
            nI &&
                out.push(sEol);
            out.push(nI + 1, ". ", sName);
            for (sResourceName in nameResult) {
                out.push(sEol, sIndent, "* ", sResourceName);
                resourceResult = nameResult[sResourceName];
                resourceResultList = resourceResult.result;
                nQ = resourceResultList.length;
                if (nQ) {
                    out.push(" - ", nQ);
                    for (nN = 0; nN < nQ; nN++) {
                        result = resourceResultList[nN];
                        
                        out.push(sEol, sIndentTwice, "+ ");
                        if (value = result.url) {
                            out.push("[", result.name, "](", value, ")");
                        }
                        else {
                            out.push("**", result.name, "**");
                        }
                        if (value = result.description) {
                            out.push(" - ", 
                                        value.replace(/\r\n\r\n|\n\n/g, sBr)
                                            .replace(/</g, "&lt;")
                                            .replace(/>/g, "&gt;"));
                        }
                        (value = result.keywords) && value.length &&
                            out.push(sBr, sIndentTwice, "  _keywords_: ", value.join(" "));
                        
                        if (bVerbose) {
                            result.version &&
                                out.push(sBr, sIndentTwice, "  _version_: ", result.version);
                            (value = getRepository(result)) &&
                                out.push(sBr, sIndentTwice, "  _repository_: [", value, "](", value, ")");
                            result.language &&
                                out.push(sBr, sIndentTwice, "  _language_: ", result.language);
                            (value = getLicenseList(result)) && value.length &&
                                out.push(sBr, sIndentTwice, "  _license_: ", value.join(", "));
                            result.stars &&
                                out.push(sBr, sIndentTwice, "  _stars_: ", result.stars);
                        }
                    }
                }
                else {
                    out.push(sBr, sIndentTwice, sName, " is not found.");
                    resourceResult.error &&
                        out.push(sBr, sIndentTwice, "Error of checking '", sName, "' at '", sResourceName, "': ", resourceResult.error);
                }
            }
        }
    }
    return out.join("");
};

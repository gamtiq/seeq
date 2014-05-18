/**
 * Helper functions for formating.
 * 
 * @module format/util
 */


/**
 * Return list of license types extracted from specified data.
 * 
 * License types extracted from <code>license</code> or <code>licenses</code> field.
 * 
 * @param {Object} data
 *      Data that should be processed.
 * @return {Array}
 *      List of found license types.
 * @alias module:format/util.getLicenseList
 */
exports.getLicenseList = function(data) {
    /*jshint boss:true*/
    var result = [],
        item, list, nI, nL, sType;
    if (data.license) {
        result.push(data.license);
    }
    else if (Array.isArray(list = data.licenses)) {
        for (nI = 0, nL = list.length; nI < nL; nI++) {
            if (item = list[nI]) {
                sType = typeof item;
                if (sType === "object" && item.type) {
                    result.push(item.type);
                }
                else if (sType === "string") {
                    result.push(item);
                }
            }
        }
    }
    return result;
};

/**
 * Return repository URL extracted from specified data.
 * 
 * URL extracted from <code>repository</code> field.
 * 
 * @param {Object} data
 *      Data that should be processed.
 * @return {String}
 *      Found repository URL or empty string.
 * @alias module:format/util.getRepository
 */
exports.getRepository = function(data) {
    var sResult = "",
        repository = data.repository;
    if (repository) {
        if (typeof repository === "object") {
            repository = repository.url;
        }
        if (repository) {
            sResult = repository;
        }
    }
    return sResult;
};

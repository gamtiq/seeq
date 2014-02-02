/**
 * @module component
 */


"use strict";

var component = require("component");

/**
 * Check whether package with the specified name is existent.
 * 
 * Data about found packages will be passed into callback as array.
 * If no package is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the package to check.
 * @param {Function} callback
 *      Function that should be called to process operation's result.
 */
exports.detect = function(name, callback) {
    component.search(name, function(err, resultList) {
        var nI, nL, pkg, result;
        if (err) {
            callback(err, []);
        }
        else {
            result = [];
            for (nI = 0, nL = resultList.length; nI < nL; nI++) {
                pkg = resultList[nI];
                if (pkg.name === name) {
                    pkg.url = "https://github.com/" + pkg.repo;
                    pkg.repo = pkg.url + ".git";
                    result.push(pkg);
                }
            }
            callback(null, result);
        }
    });
};

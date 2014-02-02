/**
 * @module npm
 */


"use strict";

var npm = require("npm"),
    bReady = false;

/**
 * Check whether package with the specified name is existent.
 * 
 * Data about the found package will be passed into callback as array.
 * If no package is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the package to check.
 * @param {Function} callback
 *      Function that should be called to process operation's result.
 */
exports.detect = function detect(name, callback) {
    if (bReady) {
        npm.commands.view([name], true, function(err, result) {
            if (result) {
                for (var sVersion in result) {
                    result = [ result[sVersion] ];
                    break;
                }
            }
            else {
                result = [];
            }
            if (err && err.code === "E404") {
                err = null;
            }
            callback(err, result);
        });
    }
    else {
        npm.load({loglevel: "silent"}, function(err, npmObj) {
            if (err) {
                callback(err, []);
            }
            else {
                bReady = true;
                npm = npmObj;
                detect(name, callback);
            }
        });
    }
};

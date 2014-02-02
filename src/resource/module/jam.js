/**
 * @module jam
 */


"use strict";

require("jamjs");

var repository = require("jamjs/lib/repository"),
    repositoryUrl = require("jamjs/lib/jamrc").DEFAULTS.repositories[0],
    mixing = require("mixing");

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
exports.detect = function(name, callback) {
    repository.get(repositoryUrl, name, function(err, result) {
        var version;
        if (result) {
            if (result.tags && (version = result.tags.latest) && (version = result.versions[version])) {
                mixing(result, version);
            }
            result = [result];
        }
        else {
            result = [];
        }
        callback(err, result);
    });
};

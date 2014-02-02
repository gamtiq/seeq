/**
 * @module bower
 */


"use strict";

var RegistryClient = require("bower-registry-client"),
    registry = new RegistryClient({force: true}),
    request = require("request");


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
    registry.lookup(name, function(err, entry) {
        var sUrl;
        if (entry) {
            if (! entry.name) {
                entry.name = name;
            }
            if ((sUrl = entry.url) && sUrl.indexOf("git://github.com/") === 0) {
                
                request("http" + sUrl.substring(3, sUrl.length - 4) + "/raw/master/bower.json", 
                    function(err, response, result) {
                        if (err || response.statusCode !== 200) {
                            result = entry;
                        }
                        else {
                            result = JSON.parse(result);
                        }
                        callback(null, [result]);
                    });
                
            }
            else {
                callback(err, [entry]);
            }
        }
        else {
            callback(err, []);
        }
    });
};

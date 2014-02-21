/**
 * @module bower
 */


"use strict";

var RegistryClient = require("bower-registry-client"),
    registry = new RegistryClient({force: true}),
    request = require("request"),
    mixing = require("mixing"),
    util = require("../util");


/**
 * Check whether package with the specified name is existent, or make search for the specified string.
 * 
 * Data about found packages will be passed into callback as array.
 * If no package is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the package to check or string to search for.
 * @param {Function} callback
 *      Function that should be called to process operation's result.
 * @param {Object} [settings]
 *      Operation settings.
 *      The following settings are supported (name - type - description):
        <ul>
        <li><code>caseSensitive</code> - <code>Boolean</code> - Whether case-sensitive check/search should be used
        <li><code>partialMatch</code> - <code>Integer</code> - Allow partial matching when checking name: 
            0 - disallow (by default), 1 - allow at the beginning of matching strings, 2 - allow substring matching
        <li><code>search</code> - <code>Boolean</code> - Whether search should be made instead of check
        <li><code>limit</code> - <code>Integer</code> - Limit of quantity of results
        </ul>
 */
exports.detect = function(name, callback, settings) {
    registry[util.isSearchSet(settings) ? "search" : "lookup"](name, function(err, packageList) {
        
        function getConfigCallback(err, response, data) {
            /*jshint validthis:true*/
            var item;
            nC--;
            if (! err && response.statusCode === 200) {
                mixing( (item = result[this.pos]), JSON.parse(data) );
                if (item.homepage) {
                    item.url = item.homepage;
                }
                else {
                    item.url = this.url;
                }
            }
            if (nC === 0) {
                callback(null, result);
            }
        }
        
        var nC = 0,
            result = [],
            bRealSearch, pkg, nI, nK, nL, nLimit, sUrl;
        
        if (packageList) {
            if (! Array.isArray(packageList)) {
                packageList = [packageList];
            }
            bRealSearch = util.isRealSearchSet(settings);
            nLimit = util.getLimit(settings);
            for (nI = 0, nL = packageList.length; nI < nL; nI++) {
                pkg = packageList[nI];
                if (! pkg.name) {
                    pkg.name = name;
                }
                if ( bRealSearch || util.isStringMatch(pkg.name, name, settings) ) {
                    sUrl = pkg.url;
                    if (! pkg.repo && ! pkg.repository && sUrl) {
                        pkg.repo = sUrl;
                    }
                    result.push(pkg);
                    nK = result.length;
                    if (sUrl && sUrl.indexOf("git://github.com/") === 0) {
                        nC++;
                        sUrl = "http" + sUrl.substring(3, sUrl.length - 4);
                        request(sUrl + "/raw/master/bower.json", 
                                getConfigCallback.bind({pos: nK - 1, url: sUrl}) );
                    }
                    if (nK === nLimit) {
                        break;
                    }
                }
            }
        }
        if (nC === 0) {
            callback(err, result);
        }
    });
};

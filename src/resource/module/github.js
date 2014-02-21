/**
 * @module github
 */


"use strict";

var github = require("octonode"),
    util = require("../util"),
    remainingLimit = 1,
    delay = 60001;

// Process search result
function handler(err, data, headers) {
    /*jshint camelcase:false, validthis:true*/
    var result = [],
        bRealSearch, item, itemList, nI, nL, nLimit, settings, sSearchName;
    if (! err) {
        remainingLimit = Number(headers["x-ratelimit-remaining"]);
        delay = (Number(headers["x-ratelimit-reset"]) * 1000) - (new Date()).getTime() + 1;
        
        settings = this.settings;
        bRealSearch = util.isRealSearchSet(settings);
        nLimit = util.getLimit(settings, 100, 100);
        
        sSearchName = this.name;
        itemList = data.items;
        for (nI = 0, nL = itemList.length; nI < nL; nI++) {
            item = itemList[nI];
            if ( bRealSearch || util.isStringMatch(item.name, sSearchName, settings) ) {
                item.api_url = item.url;
                item.url = item.homepage ? null : item.html_url;
                item.repository = item.clone_url;
                item.stars = item.stargazers_count;
                result.push(item);
                if (result.length === nLimit) {
                    break;
                }
            }
        }
        this.callback(err, result);
    }
    else if (err.message === "Search repos error") {
        setTimeout(this.send, delay);
    }
    else {
        this.callback(err, result);
    }
}

// Send search request
function send() {
    /*jshint validthis:true*/
    var settings = this.settings,
        sLanguage = settings.lang || settings.language,
        sQuery = this.name,
        nPageSize = settings.pageSize;
    if (! util.isRealSearchSet(settings)) {
        sQuery += "+in:name";
    }
    if (sLanguage) {
        sQuery += "+language:" + sLanguage;
    }
    if (typeof nPageSize !== "number" || nPageSize <= 0 || nPageSize > 100) {
        nPageSize = 100;
    }
    this.search.repos({q: sQuery, "per_page": nPageSize}, this.handler);
}

/**
 * Supported operation settings/options.
 * 
 * Conform to format of {@link https://github.com/harthur/nomnom nomnom} options.
 */
exports.settings = {
    lang: {
        help: "Search GitHub repositories that are written in the specified language"
    },
    limit: {
        help: "Limit of quantity of GitHub results; default and maximum value is 100"
    },
    user: {
        help: "GitHub username that should be used for authentication"
    },
    password: {
        help: "GitHub account password"
    },
    token: {
        help: "GitHub OAuth2 token that should be used for authentication instead of username and password"
    }
};

/**
 * Check whether repository with the specified name is existent.
 * 
 * Data about found repositories will be passed into callback as array.
 * If no repository is found, empty array will be passed into callback.
 * 
 * @param {String} name
 *      Name of the repository to check.
 * @param {Function} callback
 *      Function that should be called to process operation's result.
 * @param {Object} [settings]
 *      Operation settings.
 *      The following settings are supported (name - type - description):
        <ul>
        <li><code>caseSensitive</code> - <code>Boolean</code> - Whether case-sensitive search should be used
        <li><code>partialMatch</code> - <code>Integer</code> - Allow partial matching: 0 - disallow (by default), 
            1 - allow at the beginning of matching strings, 2 - allow substring matching
        <li><code>lang, language</code> - <code>String</code> - Search repositories that are written in the specified language
        <li><code>user</code> - <code>String</code> - GitHub username that should be used for authentication
        <li><code>password</code> - <code>String</code> - GitHub account password
        <li><code>token</code> - <code>String</code> - OAuth2 token that should be used for authentication 
            instead of username and password
        <li><code>limit</code> - <code>Integer</code> - Limit of quantity of results; default and maximum value is 100
        <li><code>pageSize</code> - <code>Integer</code> - Quantity of results per page; default and maximum value is 100
        </ul>
 */
exports.detect = function(name, callback, settings) {
    var client, request;
    if (! settings) {
        settings = {};
    }
    if (settings.token) {
        client = github.client(settings.token);
    }
    else if (settings.user && settings.password) {
        client = github.client({
            username: settings.user,
            password: settings.password
        });
    }
    else {
        client = github.client();
    }
    request = {
        search: client.search(),
        name: settings.caseSensitive ? name : name.toLowerCase(),
        callback: callback,
        settings: settings
    };
    request.send = send.bind(request);
    request.handler = handler.bind(request);
    if (remainingLimit) {
        request.send();
    }
    else {
        setTimeout(request.send, delay);
    }
};

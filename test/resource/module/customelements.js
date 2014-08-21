"use strict";
/*global chai, describe, it*/

// Tests for resource/module/customelements
describe("resource/module/customelements", function() {
    var customElements, testUtil, util;
    
    // node
    if (typeof chai === "undefined") {
        customElements = require("../../../src/resource/module/customelements");
        util = require("../../../src/resource/util");
        testUtil = require("../../testUtil");
    }
    
    
    describe(".detect(name, callback, settings)", function() {
        var detect = customElements.detect,
            getCallback = testUtil.getDetectCallback,
            getFileContent = testUtil.getFileContent,
            sourceData = getFileContent(__dirname, "../../fixtures/resource/customelements.js"),
            componentList = JSON.parse(sourceData.substring(sourceData.indexOf("["), sourceData.lastIndexOf("]") + 1));
        
        function getComponents(names) {
            return testUtil.filterObjectListByNames(componentList, names);
        }
        
        function mockSuccessRequest(data) {
            testUtil.mockSuccessRequest("http://customelementsio.herokuapp.com", "/", data == null ? sourceData : data);
        }
        
        function mockFailRequest(nCode) {
            testUtil.mockFailRequest("http://customelementsio.herokuapp.com", "/", nCode);
        }
        
        function mockIncorrectResponse() {
            customElements.clearCache();
            mockSuccessRequest(getFileContent.apply(null, arguments));
        }
        
        function mockFailedHttpRequest(nCode) {
            customElements.clearCache();
            mockFailRequest(nCode);
        }
        
        function check(prepare, sName, callback, settings) {
            testUtil.callDetect(prepare, detect, sName, callback, settings);
        }
        
        
        it("should return array of found packages", function() {
            check(mockSuccessRequest, "smart-watch", getCallback(null, getComponents("smart-watch")));
            check(mockSuccessRequest, "code", 
                    getCallback(null, getComponents(["codepen-embed-component", "coder-wall", "code-prism", "code-snippet"])), 
                    {partialMatch: 1});
            check(mockSuccessRequest, "time", 
                    getCallback(null, getComponents(["bs-timeline", "ez-idle-timeout", "local-time", "read-time", "time-ago-element"])), 
                    {partialMatch: 2});
            check(mockSuccessRequest, "code", 
                    getCallback(null, getComponents(["codepen-embed-component", "coder-wall", "code-prism"])), 
                    {partialMatch: 1, limit: 3});
            check(mockSuccessRequest, "audio", 
                    getCallback(null, getComponents(["webaudio-controls", "x-mixtaper"])), 
                    {search: true});
            check(mockSuccessRequest, "twitter-button", 
                    getCallback(null, getComponents(["twitter-button", "x-twitter-button"])), 
                    {search: true, caseSensitive: true});
            check(mockSuccessRequest, "search", 
                    getCallback(null, getComponents(["aha-table", "elasticsearch-elements", "elasticsearch-status", "freebase-search", "spotify-search"])), 
                    {search: true, partialMatch: 2});
        });
        
        it("should return empty array", function() {
            check(mockSuccessRequest, "mixing", getCallback(null, []));
            check(mockSuccessRequest, "snippet", getCallback(null, []), {partialMatch: 1});
            check(mockSuccessRequest, "rain", getCallback(null, []), {partialMatch: 2});
            check(mockSuccessRequest, "Load", getCallback(null, []), {partialMatch: 1, caseSensitive: true});
            check(mockSuccessRequest, "Model", getCallback(null, []), {search: true, caseSensitive: true});
        });
        
        it("should return IncorrectResponseError error for invalid JSON response", function(done) {
            check(mockIncorrectResponse(__dirname, "../../fixtures/invalid.json"),
                    "chronoman", getCallback(new util.IncorrectResponseError(), [], done));
        });
        
        it("should return IncorrectResponseError error for empty response", function(done) {
            check(mockIncorrectResponse(__dirname, "../../fixtures/empty.txt"),
                    "chronoman", getCallback(new util.IncorrectResponseError(), [], done));
        });
        
        it("should return FailedHttpRequestError error for 404 HTTP status code", function(done) {
            check(mockFailedHttpRequest(404), "eva", getCallback(new util.FailedHttpRequestError(), [], done));
        });
        
        it("should return FailedHttpRequestError error for 503 HTTP status code", function(done) {
            check(mockFailedHttpRequest(503), "eva", getCallback(new util.FailedHttpRequestError(), [], done));
        });
    });
});

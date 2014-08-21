"use strict";
/*global chai, describe, it*/

// Tests for resource/module/spm
describe("resource/module/spm", function() {
    var spm, testUtil, util;
    
    // node
    if (typeof chai === "undefined") {
        spm = require("../../../src/resource/module/spm");
        util = require("../../../src/resource/util");
        testUtil = require("../../testUtil");
    }
    
    
    describe(".detect(name, callback, settings)", function() {
        var detect = spm.detect,
            getCallback = testUtil.getDetectCallback,
            repositoryData = require("../../fixtures/resource/spm.json"),
            packageList = repositoryData.data.results;
        
        function getPackages(names) {
            return testUtil.filterObjectListByNames(packageList, names);
        }
        
        function mockSuccessRequest() {
            testUtil.mockSuccessRequest("http://spmjs.io", "/repositories", repositoryData);
        }
        
        function mockFailRequest(nCode) {
            testUtil.mockFailRequest("http://spmjs.io", "/repositories", nCode);
        }
        
        function mockFailedHttpRequest(nCode) {
            spm.clearCache();
            mockFailRequest(nCode);
        }
        
        function check(prepare, sName, callback, settings) {
            testUtil.callDetect(prepare, detect, sName, callback, settings);
        }
        
        
        it("should return array of found packages", function() {
            check(mockSuccessRequest, "mixing", getCallback(null, getPackages("mixing")));
            check(mockSuccessRequest, "cookie", getCallback(null, getPackages(["cookie", "cookie-store", "cookies", "cookies-js"])), {partialMatch: 1});
            check(mockSuccessRequest, "loading", getCallback(null, getPackages(["alice-loading", "anima-loading", "weteam-loading"])), {partialMatch: 2});
            check(mockSuccessRequest, "cookie", getCallback(null, getPackages(["cookie", "cookie-store"])), {partialMatch: 1, limit: 2});
            check(mockSuccessRequest, "scrolling", getCallback(null, getPackages(["iscroll", "scrolling", "ftscroller"])), {search: true});
            check(mockSuccessRequest, "Smooth", getCallback(null, getPackages(["iscroll"])), {search: true, caseSensitive: true});
            check(mockSuccessRequest, "single", getCallback(null, getPackages(["javve-events"])), {search: true, partialMatch: 2});
        });
        
        it("should return empty array", function() {
            check(mockSuccessRequest, "three", getCallback(null, []));
            check(mockSuccessRequest, "loading", getCallback(null, []), {partialMatch: 1});
            check(mockSuccessRequest, "moon", getCallback(null, []), {partialMatch: 2});
            check(mockSuccessRequest, "Cookie", getCallback(null, []), {partialMatch: 1, caseSensitive: true});
            check(mockSuccessRequest, "Scrolling", getCallback(null, []), {search: true, caseSensitive: true});
        });
        
        it("should return FailedHttpRequestError error for 404 HTTP status code", function(done) {
            check(mockFailedHttpRequest(404), "numgen", getCallback(new util.FailedHttpRequestError(), [], done));
        });
        
        it("should return FailedHttpRequestError error for 500 HTTP status code", function(done) {
            check(mockFailedHttpRequest(500), "numgen", getCallback(new util.FailedHttpRequestError(), [], done));
        });
    });
});

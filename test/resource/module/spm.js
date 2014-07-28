"use strict";
/*global chai, describe, it*/

// Tests for resource/module/spm
describe("resource/module/spm", function() {
    var expect, nock, spm, util;
    
    // node
    if (typeof chai === "undefined") {
        spm = require("../../../src/resource/module/spm");
        util = require("../../../src/resource/util");
        expect = require("../../lib/chai").expect;
        nock = require("nock");
    }
    
    
    describe(".detect(name, callback, settings)", function() {
        var detect = spm.detect,
            repositoryData = require("../../fixtures/resource/spm.json"),
            packageList = repositoryData.data.results;
        
        function getName(pkg) {
            return pkg.name;
        }
        
        function getCallback(expErr, expResult) {
            return function(err, result) {
                if (err instanceof Error) {
                    expect(err.message)
                        .equal(expErr.message);
                    expect(err.constructor)
                        .equal(expErr.constructor);
                }
                else {
                    expect(err)
                        .eql(expErr);
                }
                expect(result.map(getName))
                    .eql(expResult.map(getName));
            };
        }
        
        function getPackages(names) {
            if (typeof names === "string") {
                names = [names];
            }
            return packageList.filter(function(pkg) {
                return names.indexOf(pkg.name) > -1;
            });
        }
        
        function mockSuccessRequest() {
            nock("http://spmjs.io")
                .get("/repositories")
                .reply(200, repositoryData);
        }
        
        function mockFailRequest(nCode) {
            nock.cleanAll();
            nock("http://spmjs.io")
                .get("/repositories")
                .reply(nCode);
        }
        
        function check(prepare, sName, callback, settings) {
            prepare &&
                prepare();
            detect(sName, callback, settings);
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
        
        it("should return error", function() {
            function mockRequest(nCode) {
                spm.clearCache();
                mockFailRequest(nCode);
            }
            
            var err = new util.FailedHttpRequestError();
            
            check(mockRequest(404), "numgen", getCallback(err, []));
            check(mockRequest(500), "numgen", getCallback(err, []));
        });
    });
    
});

"use strict";
/*global describe, it*/

// Tests for resource/module/cdnjs
describe("resource/module/cdnjs", function() {
    var expect = require("chai").expect,
        mixing = require("mixing"),
        cdnjs = require("../../../src/resource/module/cdnjs"),
        fixture = require("../../fixtures/resource/cdnjs.js"),
        testUtil = require("../../testUtil"),
        util = require("../../../src/resource/util");
    
    describe(".prepareData(data)", function() {
        var prepareData = cdnjs.prepareData;

        it("should return normalized data", function() {
            var library = prepareData(fixture.normalResponse.results[4]);

            expect( library.url )
                .a( "string" );
            expect( library.repository )
                .a( "string" );
            expect( library.license )
                .a( "string" );
        });
    });
    
    describe(".detect(name, callback, settings)", function() {
        var detect = cdnjs.detect,
            getCallback = testUtil.getDetectCallback,
            apiHost = "https://api.cdnjs.com",
            apiPath = "/libraries?fields=version,description,homepage,keywords,license,repository",
            libraryList = [],
            itemList = fixture.normalResponse.results,
            i, k;
        
        for (i = 0, k = itemList.length; i < k; i++) {
            libraryList.push(cdnjs.prepareData( mixing({}, itemList[i]) ));
        }
        
        function getComponents(names) {
            return testUtil.filterObjectListByNames(libraryList, names);
        }
        
        function mockSuccessRequest(settings) {
            testUtil.mockSuccessRequest(apiHost, apiPath, fixture.normalResponse, settings);
        }
        
        function mockFailRequest(response) {
            testUtil.mockFailRequest(apiHost, apiPath, response);
        }
        
        function check(prepare, sName, callback, settings) {
            testUtil.callDetect(prepare, detect, sName, callback, settings);
        }
        
        describe("should return array of found libraries", function() {
            it("no settings", function(done) {
                check(mockSuccessRequest, "amcharts", getCallback(null, getComponents("amcharts"), done));
            });
            
            it("partialMatch: 1", function(done) {
                check(mockSuccessRequest, "open",
                        getCallback(null,
                                    getComponents([
                                        "openajax-hub",
                                        "openlayers",
                                        "openseadragon"
                                    ]),
                                    done),
                        {partialMatch: 1});
            });
            
            it("partialMatch: 2", function(done) {
                check(mockSuccessRequest, "date",
                        getCallback(null,
                                    getComponents([
                                        "air-datepicker",
                                        "angular-bootstrap-datetimepicker",
                                        "angular-relative-date",
                                        "better-dateinput-polyfill"
                                    ]),
                                    done),
                        {partialMatch: 2});
            });
            
            it("search: true", function(done) {
                check(mockSuccessRequest, "component",
                        getCallback(null,
                                    getComponents([
                                        "amazeui-react",
                                        "amazeui",
                                        "amplifyjs",
                                        "better-dateinput-polyfill",
                                        "openajax-hub"
                                    ]),
                                    done),
                        {search: true});
            });
            
            it("search: true, limit: 3", function(done) {
                check(mockSuccessRequest, "component",
                        getCallback(null,
                                    getComponents([
                                        "amazeui-react",
                                        "amazeui",
                                        "amplifyjs"
                                    ]),
                                    done),
                        {search: true, limit: 3});
            });
            
            it("search: true, caseSensitive: true", function(done) {
                check(mockSuccessRequest, "Ajax",
                        getCallback(null,
                                    getComponents([
                                        "ajaxify",
                                        "blissfuljs",
                                        "openajax-hub"
                                    ]),
                                    done),
                        {search: true, caseSensitive: true});
            });
        });
        
        describe("should return empty array", function() {
            it("for non-found name", function(done) {
                check(mockSuccessRequest, "no-result-name", getCallback(null, [], done));
            });

            it("for specific settings", function(done) {
                check(mockSuccessRequest, "Chart", getCallback(null, [], done), {partialMatch: 2, caseSensitive: true});
            });
        });
        
        it("should pass request error to callback", function(done) {
            var errorMessage = "test error";
            check(mockFailRequest(errorMessage), "invalid-json", getCallback(new Error(errorMessage), [], done));
        });
        
        it("should pass ESOCKETTIMEDOUT error to callback", function(done) {
            check(
                mockSuccessRequest({socketDelay: 3000}),
                "connection-delay",
                getCallback(new Error("ESOCKETTIMEDOUT"), [], done),
                {search: true, requestTimeout: 500}
            );
        });
        
        it("should return FailedHttpRequestError error for 404 HTTP status code", function(done) {
            check(mockFailRequest(404), "name-404", getCallback(new util.FailedHttpRequestError(), [], done));
        });
        
        it("should return FailedHttpRequestError error for 503 HTTP status code", function(done) {
            check(mockFailRequest(503), "name-503", getCallback(new util.FailedHttpRequestError(), [], done));
        });
    });
});

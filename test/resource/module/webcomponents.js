"use strict";
/*global describe, it*/

// Tests for resource/module/webcomponents
describe("resource/module/webcomponents", function() {
    var mixing = require("mixing"),
        webComponents = require("../../../src/resource/module/webcomponents"),
        testUtil = require("../../testUtil"),
        util = require("../../../src/resource/util");
    
    describe(".detect(name, callback, settings)", function() {
        var detect = webComponents.detect,
            getCallback = testUtil.getDetectCallback,
            fixture = require("../../fixtures/resource/webcomponents.js"),
            apiHost = "https://www.webcomponents.org",
            apiPath = "/api/search/",
            queryString = "?limit=100&count=",
            componentList = [];
        
        function addToComponentList(itemList) {
            var i, item, k;
            for (i = 0, k = itemList.length; i < k; i++) {
                item = mixing({}, itemList[i]);
                item.name = item.repo;
                componentList.push(item);
            }
            return addToComponentList;
        }
        
        function getComponents(names) {
            return testUtil.filterObjectListByNames(componentList, names);
        }
        
        function mockSuccessRequest(settings) {
            var nameList = ["slider", "Slider", "SLIDER"];
            var responseSet = {};
            var i, k, sliderSearchUrl;
            for (i = 0, k = nameList.length; i < k; i++) {
                sliderSearchUrl = apiPath + nameList[i] + queryString;
                responseSet[sliderSearchUrl] = fixture.sliderResponse1;
                responseSet[sliderSearchUrl + "&cursor=" + fixture.sliderResponse1.cursor] = fixture.sliderResponse2;
                responseSet[sliderSearchUrl + "&cursor=" + fixture.sliderResponse2.cursor] = fixture.sliderResponse3;
            }
            responseSet[apiPath + "no-result-name" + queryString] = fixture.emptyResponse;
            testUtil.mockSuccessRequest(apiHost, responseSet, null, settings);
        }
        
        function mockFailRequest(name, response) {
            testUtil.mockFailRequest(apiHost, apiPath + name + queryString, response);
        }
        
        function check(prepare, sName, callback, settings) {
            testUtil.callDetect(prepare, detect, sName, callback, settings);
        }
        
        addToComponentList(fixture.sliderResponse1.results)
                            (fixture.sliderResponse2.results)
                            (fixture.sliderResponse3.results);
        
        describe("should return array of found packages", function() {
            it("no settings", function(done) {
                check(mockSuccessRequest, "slider", getCallback(null, [], done));
            });
            
            it("partialMatch: 1", function(done) {
                check(mockSuccessRequest, "slider",
                        getCallback(null, [], done),
                        {partialMatch: 1});
            });
            
            it("partialMatch: 2", function(done) {
                check(mockSuccessRequest, "slider",
                        getCallback(null,
                                    getComponents([
                                        "paper-range-slider",
                                        "mp-slider",
                                        "paper-slider",
                                        "cat-slider",
                                        "s-slider",
                                        "polymer-simple-slider",
                                        "touch-slider",
                                        "l2t-paper-slider"
                                    ]),
                                    done),
                        {partialMatch: 2});
            });
            
            it("partialMatch: 2, limit: 3", function(done) {
                check(mockSuccessRequest, "slider",
                        getCallback(null, getComponents(["paper-range-slider", "mp-slider", "paper-slider"]), done), 
                        {partialMatch: 2, limit: 3});
            });
            
            it("search: true", function(done) {
                check(mockSuccessRequest, "slider",
                        getCallback(null,
                                    getComponents([
                                        "paper-range-slider",
                                        "mp-slider",
                                        "paper-slider",
                                        "cat-slider",
                                        "s-slider",
                                        "polymer-simple-slider",
                                        "touch-slider",
                                        "l2t-paper-slider"
                                    ]),
                                    done),
                        {search: true});
            });
            
            it("search: true, caseSensitive: true", function(done) {
                check(mockSuccessRequest, "Slider",
                        getCallback(null, getComponents(["cat-slider"]), done), 
                        {search: true, caseSensitive: true});
            });
        });
        
        describe("should return empty array", function() {
            it("for non-found name", function(done) {
                check(mockSuccessRequest, "no-result-name", getCallback(null, [], done));
            });

            it("for specific settings", function(done) {
                check(mockSuccessRequest, "SLIDER", getCallback(null, [], done), {search: true, caseSensitive: true});
            });
        });
        
        it("should pass request error to callback", function(done) {
            var name = "invalid-json";
            var errorMessage = "test error";
            check(mockFailRequest(name, errorMessage), name, getCallback(new Error(errorMessage), [], done));
        });
        
        it("should return FailedHttpRequestError error for 404 HTTP status code", function(done) {
            var name = "name-404";
            check(mockFailRequest(name, 404), name, getCallback(new util.FailedHttpRequestError(), [], done));
        });
        
        it("should return FailedHttpRequestError error for 503 HTTP status code", function(done) {
            var name = "name-503";
            check(mockFailRequest(name, 503), name, getCallback(new util.FailedHttpRequestError(), [], done));
        });
    });
});

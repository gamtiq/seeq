"use strict";
/*global describe, it*/

// Tests for resource/module/gulp
describe("resource/module/gulp", function() {
    var expect = require("chai").expect,
        mixing = require("mixing"),
        gulp = require("../../../src/resource/module/gulp"),
        fixture = require("../../fixtures/resource/gulp.js"),
        testUtil = require("../../testUtil"),
        util = require("../../../src/resource/util");
    
    describe(".preparePlugin(plugin)", function() {
        var preparePlugin = gulp.preparePlugin;

        it("should return normalized plugin data", function() {
            var plugin = preparePlugin(fixture.normalResponse.results[0]);

            expect( plugin.name )
                .a( "string" );
            expect( plugin.description )
                .a( "string" );
            expect( plugin.keywords )
                .a( "array" );
        });
    });
    
    describe(".detect(name, callback, settings)", function() {
        var detect = gulp.detect,
            getCallback = testUtil.getDetectCallback,
            apiHost = "https://npmsearch.com",
            apiPath = "/query?fields=name,keywords,repository,description,author,homepage,version&q=keywords:gulpfriendly&q=keywords:gulpplugin&sort=rating:desc&size=10000&start=0",
            componentList = [],
            itemList = fixture.normalResponse.results,
            i, k;
        
        for (i = 0, k = itemList.length; i < k; i++) {
            componentList.push(gulp.preparePlugin( mixing({}, itemList[i]) ));
        }
        
        function getComponents(names) {
            return testUtil.filterObjectListByNames(componentList, names);
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
        
        describe("should return array of found plugins", function() {
            it("no settings", function(done) {
                check(mockSuccessRequest, "about", getCallback(null, getComponents("about"), done));
            });
            
            it("partialMatch: 1", function(done) {
                check(mockSuccessRequest, "json",
                        getCallback(null, getComponents("json-to-yaml"), done),
                        {partialMatch: 1});
            });
            
            it("partialMatch: 2", function(done) {
                check(mockSuccessRequest, "html",
                        getCallback(null,
                                    getComponents([
                                        "striphtml",
                                        "jshtml"
                                    ]),
                                    done),
                        {partialMatch: 2});
            });
            
            it("search: true", function(done) {
                check(mockSuccessRequest, "json",
                        getCallback(null,
                                    getComponents([
                                        "translation2json",
                                        "replace-task",
                                        "about",
                                        "json-to-yaml"
                                    ]),
                                    done),
                        {search: true});
            });
            
            it("search: true, limit: 2", function(done) {
                check(mockSuccessRequest, "json",
                        getCallback(null,
                                    getComponents([
                                        "translation2json",
                                        "replace-task"
                                    ]),
                                    done),
                        {search: true, limit: 2});
            });
            
            it("search: true, caseSensitive: true", function(done) {
                check(mockSuccessRequest, "JSON",
                        getCallback(null, getComponents(["translation2json", "json-to-yaml"]), done), 
                        {search: true, caseSensitive: true});
            });
        });
        
        describe("should return empty array", function() {
            it("for non-found name", function(done) {
                check(mockSuccessRequest, "no-result-name", getCallback(null, [], done));
            });

            it("for specific settings", function(done) {
                check(mockSuccessRequest, "Task", getCallback(null, [], done), {search: true, caseSensitive: true});
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

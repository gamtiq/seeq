"use strict";
/*global chai, describe, it*/

// Tests for resource/util
describe("resource/util", function() {
    var expect, util;
    
    // node
    if (typeof chai === "undefined") {
        util = require("../../src/resource/util.js");
        expect = require("../lib/chai").expect;
    }
    
    
    describe(".getLimit", function() {
        var getLimit = util.getLimit;
        
        describe("getLimit() | getLimit({}) | getLimit({limit: 0}) | getLimit({limit: <negative number>})", function() {
            it("should return Number.MAX_VALUE", function() {
                expect(getLimit())
                    .equal(Number.MAX_VALUE);
                expect(getLimit({}))
                    .equal(Number.MAX_VALUE);
                expect(getLimit({limit: 0}))
                    .equal(Number.MAX_VALUE);
                expect(getLimit({limit: -100}))
                    .equal(Number.MAX_VALUE);
            });
        });
        
        describe("getLimit({limit: <positive number>}) | getLimit({limit: <positive number>}, defaultValue)", function() {
            it("should return value of limit field", function() {
                function check(nLimit, nDefault) {
                    expect( getLimit.apply(null, [{limit: nLimit}].concat(arguments.length > 1 ? [nDefault] : [])) )
                        .equal(nLimit);
                }
                
                check(1);
                check(123);
                check(5861234528904);
                check(Number.MAX_VALUE);
                
                check(25, 100);
                check(78, 12);
                check(1, 0);
            });
        });
        
        describe("getLimit({}, defaultValue) | getLimit({limit: <non-positive number>}, defaultValue)", function() {
            it("should return default value", function() {
                function check(nLimit, nDefault) {
                    expect( getLimit(typeof nLimit === "number" ? {limit: nLimit} : {}, nDefault) )
                        .equal(nDefault);
                }
                
                check(null, 123);
                check(null, Number.MAX_VALUE);
                
                check(0, 11);
                check(-Number.MIN_VALUE, Number.MAX_VALUE);
                check(-24954, 6789);
                check(-5, -10);
            });
        });
        
        describe("getLimit({limit: limit}, defaultValue, maxValue)", function() {
            function check(nLimit, nDefault, nMax, nResult) {
                expect( getLimit({limit: nLimit}, nDefault, nMax) )
                    .equal(nResult);
            }
            
            it("should return field value", function() {
                check(5, 10, 100, 5);
                check(578, 18, 34500, 578);
                check(79, 80, 81, 79);
            });
            
            it("should return default value", function() {
                check(-7, 11, 100, 11);
                check(null, 9, 11, 9);
                check(123, 50, 100, 50);
            });
            
            it("should return maximum value", function() {
                check(0, 0, 10, 10);
                check(52, null, 23, 23);
                check(-17, "", 57, 57);
            });
        });
    });
    
    describe(".isRealSearchSet(settings)", function() {
        var isRealSearchSet = util.isRealSearchSet;
        
        it("should return true", function() {
            expect( isRealSearchSet({search: true}) )
                .equal(true);
            expect( isRealSearchSet({search: 100}) )
                .equal(true);
            expect( isRealSearchSet({search: "search"}) )
                .equal(true);
        });
        
        it("should return false", function() {
            expect( isRealSearchSet() )
                .equal(false);
            expect( isRealSearchSet({}) )
                .equal(false);
            expect( isRealSearchSet({search: false}) )
                .equal(false);
            expect( isRealSearchSet({search: null}) )
                .equal(false);
            expect( isRealSearchSet({search: ""}) )
                .equal(false);
            expect( isRealSearchSet({search: 0}) )
                .equal(false);
        });
    });
    
    describe(".isSearchSet(settings)", function() {
        var isSearchSet = util.isSearchSet;
        
        it("should return true", function() {
            expect( isSearchSet({search: true}) )
                .equal(true);
            expect( isSearchSet({caseSensitive: 1}) )
                .equal(true);
            expect( isSearchSet({partialMatch: 2}) )
                .equal(true);
            expect( isSearchSet({partialMatch: "part", search: false}) )
                .equal(true);
            expect( isSearchSet({caseSensitive: 0, search: true}) )
                .equal(true);
            expect( isSearchSet({caseSensitive: null, partialMatch: true, search: 0}) )
                .equal(true);
        });
        
        it("should return false", function() {
            expect( isSearchSet() )
                .equal(false);
            expect( isSearchSet({}) )
                .equal(false);
            expect( isSearchSet({search: false}) )
                .equal(false);
            expect( isSearchSet({caseSensitive: null}) )
                .equal(false);
            expect( isSearchSet({partialMatch: 0}) )
                .equal(false);
            expect( isSearchSet({caseSensitive: false, partialMatch: "", search: null}) )
                .equal(false);
            expect( isSearchSet({caseSensitive: null, search: 0}) )
                .equal(false);
            expect( isSearchSet({caseSensitive: 0, partialMatch: false}) )
                .equal(false);
        });
    });
    
    describe(".isStringMatch(value, searchValue, settings)", function() {
        var isStringMatch = util.isStringMatch;
        
        it("should return true", function() {
            expect( isStringMatch("abcdef", "abcdef") )
                .equal(true);
            expect( isStringMatch(["abcd", "abcde", "abcdef", "abcdefgh"], "abcdef") )
                .equal(true);
            expect( isStringMatch("abcdef", "abcde", {partialMatch: 1}) )
                .equal(true);
            expect( isStringMatch("abcdef", "cd", {partialMatch: 2}) )
                .equal(true);
            expect( isStringMatch(["AbCdEf", "abcDeF", "ABC", "Def", "aBc"], "aBc", {caseSensitive: true}) )
                .equal(true);
            expect( isStringMatch(["OMEGA", "abcDeF", "Venus", "DEF"], "DE", {caseSensitive: true, partialMatch: 1}) )
                .equal(true);
            expect( isStringMatch(["OMEGA", "abcDeF", "Venus", "Def"], "EN", {caseSensitive: false, partialMatch: 2}) )
                .equal(true);
            expect( isStringMatch(["one two three four five", "six", "SEVEN", "TOUR", "Colour"], "OUR", 
                                    {caseSensitive: true, search: true}) )
                .equal(true);
        });
        
        it("should return false", function() {
            expect( isStringMatch("abcdef", "bc") )
                .equal(false);
            expect( isStringMatch(["abcdef", "trio", "zyx", "js"], "dj") )
                .equal(false);
            expect( isStringMatch(["abc", "Define", "fun", "do"], "define", {caseSensitive: true}) )
                .equal(false);
            expect( isStringMatch(["abc", "Define", "fun", "do"], "fine", {partialMatch: 1}) )
                .equal(false);
            expect( isStringMatch(["abcde", "Astra", "Sun", "DOM"], "domain", {partialMatch: 2}) )
                .equal(false);
            expect( isStringMatch(["abc", "Define", "fun", "do"], "DE", {caseSensitive: true, partialMatch: 1}) )
                .equal(false);
            expect( isStringMatch(["language", "Define", "fun", "prototype"], "Type", {caseSensitive: true, partialMatch: 2}) )
                .equal(false);
            expect( isStringMatch(["component layout wizard", "storage", "Object", "jQuery", "Angular"], "Angle", {search: true}) )
                .equal(false);
            expect( isStringMatch(["Grunt, Gulp, Build", "MAKE IT", "Object", "jQuery", "Knockout"], "query", 
                                    {caseSensitive: true, search: true}) )
                .equal(false);
        });
    });
    
    describe(".getHttpRequestError(err, response)", function() {
        var getHttpRequestError = util.getHttpRequestError;
        
        it("should return passed error object", function() {
            var err = new Error("Test error");
            expect( getHttpRequestError(err, {}) )
                .equal(err);
        });
        
        it("should return instance of FailedHttpRequestError", function() {
            expect( getHttpRequestError(null, {}) )
                .instanceOf(util.FailedHttpRequestError);
        });
    });
});

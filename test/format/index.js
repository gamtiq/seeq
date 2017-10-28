"use strict";
/*global describe, it*/

// Tests for format API
describe("format", function() {
    var expect = require("chai").expect,
        format = require("../../src/format"),
        sourceFormatMap = format.getMap(),
        testFormatMap = {};
    
    function emptyFunc() {
    }
    
    function clearFormats() {
        var formatMap = format.getMap(),
            sName;
        for (sName in formatMap) {
            format.remove(sName);
        }
    }
    
    function getTestFormatter(name) {
        return function(data, settings) {
            if (! settings) {
                settings = {};
            }
            if (! settings.queryList) {
                settings.queryList = Object.keys(data);
            }
            if (! ("verbose" in settings)) {
                settings.verbose = false;
            }
            return [name, ": ", data, "; query list - ", settings.queryList.join(", "), "; verbose - ", settings.verbose].join("");
        };
    }
    
    function setTestFormats() {
        var formatter, nI, sName;
        clearFormats();
        for (nI = 1; nI < 4; nI++) {
            sName = "f" + nI;
            format.set(sName, testFormatMap[sName] = getTestFormatter(sName));
        }
    }
    
    before(function() {
        setTestFormats();
    });
    
    after(function() {
        var sName;
        clearFormats();
        for (sName in sourceFormatMap) {
            format.set(sName, sourceFormatMap[sName]);
        }
    });
    
    
    describe(".format", function() {
        var formatFunc = format.format;
        
        function getTestFormatResult(name, data, settings) {
            return testFormatMap[name].call(null, data, settings);
        }
        
        function check(data, name, settings) {
            expect( formatFunc(data, name, settings) )
                .equal( getTestFormatResult(name, data, settings) );
        }
        
        describe("format(data, name)", function() {
            it("should return result of formatter with specified name", function() {
                check({a: 1}, "f1");
                check(testFormatMap, "f2");
                check({}, "f3");
            });
            
            it("should return empty string", function() {
                expect( formatFunc({a: 1}, "unknown") )
                    .equal( "" );
                expect( formatFunc({a: 1}, "") )
                    .equal( "" );
                expect( formatFunc({a: 1}, null) )
                    .equal( "" );
            });
        });
        
        describe("format(data, name, settings)", function() {
            it("should return result of formatter with specified name using given settings to format data", function() {
                check({a: 1}, "f1", {verbose: true});
                check({a: 1}, "f1", {verbose: false});
                check({a: 1}, "f2", {verbose: true, queryList: ["b", "c"]});
                check({a: 1}, "f2", {verbose: false, queryList: ["x", "y", "z"]});
            });
        });
    });
    
    
    describe(".get(name)", function() {
        var get = format.get;
        
        function check(name) {
            expect( get(name) )
                .equal( testFormatMap[name] );
            return check;
        }
        
        it("should return function that represents formatter with specified name", function() {
            check("f1")
                ("f2")
                ("f3");
        });
        
        it("should return null", function() {
            expect( get("f") )
                .equal( null );
            expect( get("unknown") )
                .equal( null );
            expect( get(null) )
                .equal( null );
            expect( get(false) )
                .equal( null );
        });
    });
    
    
    describe(".exists(name)", function() {
        var exists = format.exists;
        
        it("should return true", function() {
            expect( exists("f1") )
                .equal( true );
            expect( exists("f2") )
                .equal( true );
            expect( exists("f3") )
                .equal( true );
        });
        
        it("should return false", function() {
            expect( exists("abcd") )
                .equal( false );
            expect( exists("format") )
                .equal( false );
            expect( exists({}) )
                .equal( false );
            expect( exists(123) )
                .equal( false );
        });
    });
    
    
    describe(".getMap()", function() {
        var getMap = format.getMap;
        
        after(setTestFormats);
        
        it("should return object that represents all available formatters", function() {
            expect( getMap() )
                .eql( testFormatMap );
            
            clearFormats();
            format.set("a", getTestFormatter);
            format.set("b", getTestFormatter);
            expect( getMap() )
                .eql( {a: getTestFormatter, b: getTestFormatter} );
        });
    });
    
    
    describe(".getNameList()", function() {
        var getNameList = format.getNameList;
        
        after(setTestFormats);
        
        it("should return list containing names of all available formatters", function() {
            expect( getNameList() )
                .eql( Object.keys(testFormatMap) );
            
            clearFormats();
            format.set("first", getTestFormatter);
            format.set("second", getTestFormatter);
            format.set("third", getTestFormatter);
            expect( getNameList() )
                .eql( ["first", "second", "third"] );
        });
    });
    
    
    describe(".set(name, format)", function() {
        var set = format.set;
        
        after(setTestFormats);
        
        it("should set formatter with specified name", function() {
            function check(name, formatter) {
                set(name, formatter);
                expect( format.get(name) )
                    .equal( formatter );
            }
            
            check("undefined", emptyFunc);
            check("new", getTestFormatter("new"));
        });
        
        it("should throw an error", function() {
            function wrap(name, format) {
                return function() {
                    set(name, format);
                };
            }
            
            var func = wrap("error", null);
            expect( func )
                .to["throw"](Error);
            expect( func )
                .to["throw"](/should be a function/i);
            
            expect( wrap("a", true) )
                .to["throw"](Error);
            expect( wrap("a", {}) )
                .to["throw"](Error);
            expect( wrap("a", "format") )
                .to["throw"](Error);
        });
    });
    
    
    describe(".remove(name)", function() {
        var remove = format.remove;
        
        after(setTestFormats);
        
        it("should remove formatter with specified name", function() {
            function check(name) {
                remove(name);
                expect( format.get(name) )
                    .equal( null );
            }
            
            check("f1");
            check("f2");
            check("f3");
        });
    });
});

"use strict";
/*global chai, describe, it*/

// Tests for formatters
describe("formatter", function() {
    var fs = require("fs"),
        path = require("path"),
        expect = require("../lib/chai").expect,
        searchResult = require("../fixtures/result.json"),
        queryList = Object.keys(searchResult);
    
    function normalizeLineEnd(text) {
        return text.replace(/\r\n/g, "\n");
    }
    
    function getFileContent(filePath) {
        return normalizeLineEnd( fs.readFileSync(filePath, {encoding: 'utf8'}).toString() );
    }
    
    function getFormatResult(name) {
        return getFileContent(path.resolve(__dirname, "../expected/format/" + name));
    }
    
    
    describe("format/text", function() {
        var format = require("../../src/format/text");
        
        it("should return plain text representing result of search", function() {
            expect( normalizeLineEnd( format(searchResult, {queryList: queryList, verbose: false}) ) )
                .equal( getFormatResult("text.txt") );
        });
        
        it("should return plain text representing detailed result of search", function() {
            expect( normalizeLineEnd( format(searchResult, {queryList: queryList, verbose: true}) ) )
                .equal( getFormatResult("text_verbose.txt") );
        });
    });
    
    
    describe("format/json", function() {
        var format = require("../../src/format/json");
        
        it("should return JSON representing result of search", function() {
            expect( normalizeLineEnd( format(searchResult, {queryList: queryList, verbose: false}) ) )
                .equal( getFormatResult("json.json") );
        });
        
        it("should return JSON representing detailed result of search", function() {
            expect( normalizeLineEnd( format(searchResult, {queryList: queryList, verbose: true}) ) )
                .equal( getFormatResult("json_verbose.json") );
        });
    });
    
    
    describe("format/markdown", function() {
        var format = require("../../src/format/markdown");
        
        it("should return Markdown representing result of search", function() {
            expect( normalizeLineEnd( format(searchResult, {queryList: queryList, verbose: false}) ) )
                .equal( getFormatResult("markdown.md") );
        });
        
        it("should return Markdown representing detailed result of search", function() {
            expect( normalizeLineEnd( format(searchResult, {queryList: queryList, verbose: true}) ) )
                .equal( getFormatResult("markdown_verbose.md") );
        });
    });
    
    
    describe("format/raw", function() {
        var format = require("../../src/format/raw");
        
        it("should return raw JSON representing result of search", function() {
            expect( normalizeLineEnd( format(searchResult, {queryList: queryList, verbose: false}) ) )
                .equal( getFormatResult("raw.json") );
        });
        
        it("should return raw JSON representing detailed result of search", function() {
            expect( normalizeLineEnd( format(searchResult, {queryList: queryList, verbose: true}) ) )
                .equal( getFormatResult("raw_verbose.json") );
        });
    });
});

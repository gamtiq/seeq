"use strict";
/*global describe, it*/

// Tests for seeq
describe("seeq", function() {
    var expect = require("chai").expect,
        seeq = require("../src/seeq.js");
    
    describe(".searchName(name, callback, settings)", function() {
        var searchName = seeq.searchName;
        
        it("should return null", function() {
            function callback(result) {
                expect(result)
                    .equal(null);
            }
            
            searchName(null, callback);
            searchName("mixing", callback, {resource: ["unknown-resource", "another-unknown-resource"]});
        });
    });
    
    
    describe(".search(names, callback, settings)", function() {
        var search = seeq.search;
        
        it("should return null", function() {
            function callback(result) {
                expect(result)
                    .equal(null);
            }
            
            search(null, callback);
            search("", callback);
            search([], callback);
        });
    });
});

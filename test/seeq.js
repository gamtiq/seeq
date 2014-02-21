"use strict";
/*global chai, describe, it*/

// Tests for seeq
describe("seeq", function() {
    var expect, seeq;
    
    // node
    if (typeof chai === "undefined") {
        seeq = require("../src/seeq.js");
        expect = require("./lib/chai").expect;
    }
    
    
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

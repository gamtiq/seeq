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
    
    
    describe(".checkName(name, callback, settings)", function() {
        var checkName = seeq.checkName;
        
        it("should return null", function() {
            function callback(result) {
                expect(result)
                    .equal(null);
            }
            
            checkName(null, callback);
            checkName("mixing", callback, {resource: ["unknown-resource", "another-unknown-resource"]});
        });
    });
    
    
    describe(".check(names, callback, settings)", function() {
        var check = seeq.check;
        
        it("should return null", function() {
            function callback(result) {
                expect(result)
                    .equal(null);
            }
            
            check(null, callback);
            check("", callback);
            check([], callback);
        });
    });
});

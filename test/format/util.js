"use strict";
/*global describe, it*/

// Tests for format utils
describe("format/util", function() {
    var expect = require("chai").expect,
        util = require("../../src/format/util");
    
    
    describe(".getLicenseList(data)", function() {
        var getLicenseList = util.getLicenseList;
        
        it("should return array of found license types", function() {
            expect( getLicenseList({license: "MIT"}) )
                .eql( ["MIT"] );
            expect( getLicenseList({license: {name: "MIT"}}) )
                .eql( ["MIT"] );
            expect( getLicenseList({license: {type: "MIT"}}) )
                .eql( ["MIT"] );
            expect( getLicenseList({license: {key: "MIT"}}) )
                .eql( ["MIT"] );
            expect( getLicenseList({license: {spdx_id: "MIT"}}) )
                .eql( ["MIT"] );
            expect( getLicenseList({licenses: [{type: "MIT"}, {name: "BSD"}, {key: "Apache"}, {spdx_id: "LGPL"}, "GPL-3"]}) )
                .eql( ["MIT", "BSD", "Apache", "LGPL", "GPL-3"] );
        });
        
        it("should return empty array", function() {
            expect( getLicenseList({}) )
                .eql( [] );
            expect( getLicenseList({lcns: "LGPL"}) )
                .eql( [] );
            expect( getLicenseList({licence: "BSD"}) )
                .eql( [] );
            expect( getLicenseList({licenses: "MIT"}) )
                .eql( [] );
            expect( getLicenseList({licenses: [{typ: "MIT"}, {license: "BSD"}, {ref: "Apache"}]}) )
                .eql( [] );
        });
    });
    
    
    describe(".getRepository(data)", function() {
        var getRepository = util.getRepository,
            sRepoUrl = "https://github.com/gamtiq/seeq.git";
        
        it("should return found repository URL", function() {
            expect( getRepository({repository: sRepoUrl}) )
                .equal( sRepoUrl );
            expect( getRepository({repository: {url: sRepoUrl}}) )
                .eql( sRepoUrl );
        });
        
        it("should return empty string", function() {
            expect( getRepository({}) )
                .equal( "" );
            expect( getRepository({repo: sRepoUrl}) )
                .eql( "" );
            expect( getRepository({repository: {uri: sRepoUrl}}) )
                .eql( "" );
        });
    });
});

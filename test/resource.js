"use strict";
/*global chai, describe, it*/

// Tests for resource/index.js
describe("resource", function() {
    var expect, resource;
    
    // node
    if (typeof chai === "undefined") {
        resource = require("../src/resource");
        expect = require("./lib/chai").expect;
    }
    
    
    function checkResourceAbsence(sName) {
        expect( resource.isAvailable(sName) )
            .equal(false);
    }
    
    function checkResourcePresence(sName) {
        expect( resource.isAvailable(sName) )
            .equal(true);
    }
    
    
    describe(".isAvailable(name)", function() {
        it("should return true", function() {
            checkResourcePresence("github");
            checkResourcePresence("nPM");
            checkResourcePresence("compoNent");
            checkResourcePresence("Bower");
            checkResourcePresence("JAM");
        });
        
        it("should return false", function() {
            checkResourceAbsence(new Date().toString());
            checkResourceAbsence("");
            checkResourceAbsence("GitRes");
            checkResourceAbsence("components");
            checkResourceAbsence("bow");
            checkResourceAbsence("Candy");
        });
    });
    
    
    describe(".getIdByName(name)", function() {
        var getIdByName = resource.getIdByName;
        
        it("should return resource id", function() {
            expect( getIdByName("GitHUB") )
                .equal("github");
            expect( getIdByName("npm") )
                .equal("npm");
            expect( getIdByName("CompoNent") )
                .equal("component");
            expect( getIdByName("BOWER") )
                .equal("bower");
            expect( getIdByName("Jam") )
                .equal("jam");
        });
        
        it("should return null", function() {
            expect( getIdByName(new Date().toString()) )
                .equal(null);
            expect( getIdByName("") )
                .equal(null);
            expect( getIdByName("world") )
                .equal(null);
            expect( getIdByName("star") )
                .equal(null);
            expect( getIdByName("music") )
                .equal(null);
            expect( getIdByName("show") )
                .equal(null);
        });
    });
    
    
    describe(".getAllNameList()", function() {
        var getAllNameList = resource.getAllNameList;
        
        it("should return list of resource names", function() {
            var nameList = getAllNameList(),
                nI, nL;
            expect( nameList )
                .be["instanceof"](Array);
            
            for (nI = 0, nL = nameList.length; nI < nL; nI++) {
                checkResourcePresence(nameList[nI]);
            }
        });
    });
    
    
    describe(".getList", function() {
        var getList = resource.getList;
        
        describe("getList()", function() {
            it("should return list of all available resources", function() {
                var resourceList = getList(),
                    sourceList = require("../src/resource/list.json"),
                    resourceName = {},
                    nI, nL;
                
                for (nI = 0, nL = sourceList.length; nI < nL; nI++) {
                    resourceName[ sourceList[nI].name ] = true;
                }
                
                expect( resourceList )
                    .be["instanceof"](Array);
                expect( resourceList.length )
                    .equal(sourceList.length);
                
                for (nI = 0, nL = resourceList.length; nI < nL; nI++) {
                    expect( resourceList[nI].name in resourceName )
                        .equal(true);
                }
            });
        });
        
        describe("getList({selectResource: 'name'}) | getList({selectResource: ['name1', 'name2', ...]})", function() {
            it("should return list of resources with specified names", function() {
                var resourceList = getList({selectResource: "GitHub"}),
                    nameList, nI, nL;
                
                expect( resourceList )
                    .be["instanceof"](Array);
                expect( resourceList.length )
                    .equal(1);
                expect( resourceList[0].name.toLowerCase() )
                    .equal("github");
                
                resourceList = getList({selectResource: ["NPM"]});
                
                expect( resourceList )
                    .be["instanceof"](Array);
                expect( resourceList.length )
                    .equal(1);
                expect( resourceList[0].name.toLowerCase() )
                    .equal("npm");
                
                resourceList = getList({selectResource: ["BOWER", "Jam", "component"]});
                
                expect( resourceList )
                    .be["instanceof"](Array);
                expect( resourceList.length )
                    .equal(3);
                
                nameList = ["bower", "jam", "component"];
                for (nI = 0, nL = resourceList.length; nI < nL; nI++) {
                    expect( nameList.indexOf( resourceList[0].name.toLowerCase() ) )
                        .above(-1);
                    
                }
            });
            
            it("should return empty array", function() {
                var list = getList({selectResource: new Date().toString()});
            
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
                
                list = getList({selectResource: ["super-site", "extra-space", "alpha-beta-gamma"]});
                
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
            });
        });
        
        describe("getList({includeApi: true})", function() {
            it("should return list of resources with 'api' field included", function() {
                
                function check(list) {
                    var item, nI, nL;
                    expect( list )
                        .be["instanceof"](Array);
                    for (nI = 0, nL = list.length; nI < nL; nI++) {
                        item = list[nI];
                        expect( item )
                            .an("object");
                        expect( item )
                            .haveOwnProperty("api");
                        expect( item.api )
                            .an("object");
                    }
                }
                
                check( getList({includeApi: true}) );
                
                check( getList({selectResource: ["bower", "Jam", "Github"], includeApi: true}) );
            });
        });
        
    });
    
    
    describe(".getMap", function() {
        var getMap = resource.getMap;
        
        describe("getMap()", function() {
            it("should return object containing data about all available resources", function() {
                var resourceMap = getMap(),
                    sourceList = require("../src/resource/list.json"),
                    nI, nL, sName;
                
                nI = 0;
                for (sName in resourceMap) {
                    nI++;
                }
                expect( nI )
                    .equal(sourceList.length);
                
                for (nI = 0, nL = sourceList.length; nI < nL; nI++) {
                    expect( sourceList[nI].name.toLowerCase() in resourceMap )
                        .equal(true);
                }
            });
        });
        
        describe("getMap({selectResource: 'name'}) | getMap({selectResource: ['name1', 'name2', ...]})", function() {
            it("should return object containing data about resources with specified names", function() {
                
                function check(names) {
                    /*jshint expr:true*/
                    var map = getMap({selectResource: names}),
                        nI, nL, sName;
                    
                    expect( map )
                        .an("object");
                    expect( map )
                        .not.empty;
                    
                    if (typeof names === "string") {
                        names = [names];
                    }
                    for (nI = 0, nL = names.length; nI < nL; nI++) {
                        names[nI] = names[nI].toLowerCase();
                    }
                    
                    nI = 0;
                    for (sName in map) {
                        nI++;
                        expect( names.indexOf(sName) )
                            .above(-1);
                    }
                    expect( nI )
                        .equal(names.length);
                    
                }
                
                check("npm");
                
                check(["GitHub", "COMPONENT", "Jam"]);
                
                check(["NPM", "bower"]);
            });
            
            it("should return empty object", function() {
                /*jshint expr:true*/
                expect( getMap({selectResource: new Date().toString()}) )
                    .empty;
                
                expect( getMap({selectResource: ["a", "b", "c", "z"]}) )
                    .empty;
            });
        });
        
        describe("getMap({includeApi: true})", function() {
            it("should return object containing data about resources with 'api' field included", function() {
                
                function check(map) {
                    /*jshint expr:true*/
                    var item, sName;
                    expect( map )
                        .an("object");
                    expect( map )
                        .not.empty;
                    for (sName in map) {
                        item = map[sName];
                        expect( item )
                            .an("object");
                        expect( item )
                            .include.key("api");
                        expect( item.api )
                            .an("object");
                    }
                }
                
                check( getMap({includeApi: true}) );
                
                check( getMap({selectResource: ["npm", "Component", "BOWER"], includeApi: true}) );
            });
        });
        
    });
    
    
    describe(".add(resource)", function() {
        var add = resource.add;
        
        it("should add resource into the list of available resources", function() {
            var sName = "Test Resource",
                list;
        
            checkResourceAbsence(sName);
            
            list = add({name: sName, api: {}});
            
            checkResourcePresence(sName);
            expect( list )
                .equal(resource);
            
            list = resource.getList();
            expect( list.map(function(res) {return res.name;}) )
                .contain(sName);
            
            expect( resource.getMap() )
                .contain.key(sName.toLowerCase());
            
            resource.resetList();
            
            checkResourceAbsence(sName);
        });
        
        it("should throw an error", function() {
            function a(res) {
                return function() {
                    add(res);
                };
            }
            
            var addRes = a({});
            expect( addRes )
                .to["throw"](Error);
            expect( addRes )
                .to["throw"](/unknown name/i);
            
            expect( a({name: "abc"}) )
                .to["throw"](/unknown api/i);
            expect( a({name: "abc", api: 5}) )
                .to["throw"](/unknown api/i);
            expect( a({name: "abc", module: true}) )
                .to["throw"](/unknown api/i);
            
            expect( a({name: "npm", module: "path"}) )
                .to["throw"](/duplicate name/i);
            expect( a({name: "COMPONENT", api: {}}) )
                .to["throw"](/duplicate name/i);
            expect( a({name: "Jam", module: "path/to/jam"}) )
                .to["throw"](/duplicate name/i);
        });
    });
    
    
    describe(".resetList()", function() {
        var resetList = resource.resetList;
        
        it("should set list of resources to initial state", function() {
            var list = resource.getList(),
                map = resource.getMap(),
                sName = "resource at " + new Date().getTime(),
                result;
            
            checkResourceAbsence(sName);
            
            resource.add({name: sName, module: "some/path"});
            
            checkResourcePresence(sName);
            
            result = resetList();
            
            checkResourceAbsence(sName);
            expect( result )
                .equal(resource);
            expect( resource.getList() )
                .eql(list);
            expect( resource.getMap() )
                .eql(map);
        });
    });
});

"use strict";
/*global after, afterEach, before, describe, it*/

// Tests for resource/index.js
describe("resource", function() {
    var expect = require("chai").expect,
        initialResourceList = require("./fixtures/resource.json"),
        resource = require("../src/resource"),
        oldResourceList;
    
    function toLowerCase(value) {
        return value.toLowerCase();
    }
    
    function checkResourceAbsence(sName) {
        expect( resource.isAvailable(sName) )
            .equal(false);
    }
    
    function checkResourcePresence(sName) {
        expect( resource.isAvailable(sName) )
            .equal(true);
    }
    
    function checkResTags(resList, tagList, checkAllTags) {
        var checkResourceTags = resource.checkResourceTags,
            nI, nL;
        if (! Array.isArray(resList)) {
            resList = [resList];
        }
        if (! Array.isArray(tagList)) {
            tagList = [tagList];
        }
        tagList = tagList.map(toLowerCase);
        
        expect( resList.length )
            .above(0);
        for (nI = 0, nL = resList.length; nI < nL; nI++) {
            expect( checkResourceTags(resList[nI], tagList, checkAllTags) )
                .equal(true);
        }
    }
    
    
    before(function() {
        oldResourceList = resource.getList();
        resource.initList(initialResourceList);
    });
    
    afterEach(resource.resetList);
    
    after(function() {
        resource.initList(oldResourceList);
    });
    
    
    describe(".isAvailable(name)", function() {
        it("should return true", function() {
            checkResourcePresence("github");
            checkResourcePresence("nPM");
            checkResourcePresence("Bower");
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
            expect( getIdByName("BOWER") )
                .equal("bower");
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
    
    
    describe(".getNameList()", function() {
        var getNameList = resource.getNameList;
        
        it("should return list of names of selected resources", function() {
            function checkResNames(settings, resultNames) {
                var nameList = getNameList(settings),
                    nI, nL;
                
                if (Array.isArray(resultNames)) {
                    resultNames = resultNames.map(toLowerCase);
                }
                else {
                    resultNames = [resultNames.toLowerCase()];
                }
                
                expect( nameList )
                    .instanceOf(Array);
                expect( nL = nameList.length )
                    .equal(resultNames.length);
                for (nI = 0; nI < nL; nI++) {
                    expect( resultNames.indexOf(nameList[nI].toLowerCase()) )
                        .above(-1);
                }
            }
            
            var allNameList = resource.getAllNameList();
            
            checkResNames(null, allNameList);
            checkResNames({selectName: null, selectTag: null}, allNameList);
            checkResNames({selectName: [], selectTag: []}, allNameList);
            
            checkResNames({selectName: "Github"}, "GitHub");
            checkResNames({selectName: ["Github", "Bower"]}, ["GitHub", "Bower"]);
            
            checkResNames({selectTag: "project"}, "GitHub");
            checkResNames({selectTag: ["node", "micro"]}, ["npm", "Grunt", "microjs"]);
            
            checkResNames({selectName: "Github", selectTag: "package"}, 
                            ["GitHub", "npm", "Bower"]);
            checkResNames({selectName: "Github", selectTag: ["library", "component"]}, 
                            ["GitHub", "npm", "Bower", "MicroJS"]);
            checkResNames({selectName: ["Microjs", "Grunt"], selectTag: "node"}, 
                            ["Microjs", "Npm", "Grunt"]);
            checkResNames({selectName: ["Grunt"], selectTag: ["framework", "library"]}, 
                            ["GitHub", "Grunt", "NPM", "Bower", "MicroJS"]);
            
            checkResNames({selectName: "Grunt", selectTag: ["library", "package"], checkAllTags: true}, 
                            ["NPM", "Bower", "Grunt", "Github"]);
            checkResNames({selectName: ["Grunt", "MicroJS"], selectTag: ["browser", "component"], checkAllTags: true}, 
                            ["Bower", "Grunt", "MicroJS"]);
        });
    });
    
    
    describe(".checkResourceTags", function() {
        var checkResourceTags = resource.checkResourceTags,
            res = {tag: ["a", "b", "c", "delta"]},
            resNoTag = {tag: []};
        
        describe("checkResourceTags(resource, tagList)", function() {
            it("should return true", function() {
                expect( checkResourceTags(resNoTag, []) )
                    .equal(true);
                expect( checkResourceTags(res, []) )
                    .equal(true);
                expect( checkResourceTags(res, ["a"]) )
                    .equal(true);
                expect( checkResourceTags(res, ["omega", "delta"]) )
                    .equal(true);
                expect( checkResourceTags(res, ["tree", "x", "c", "leaf"]) )
                    .equal(true);
                expect( checkResourceTags(res, ["c", "b", "a"]) )
                    .equal(true);
                expect( checkResourceTags(res, ["d", "a", "b", "c"]) )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( checkResourceTags(resNoTag, ["a"]) )
                    .equal(false);
                expect( checkResourceTags(res, ["alfa"]) )
                    .equal(false);
                expect( checkResourceTags(res, ["x", "y", "z"]) )
                    .equal(false);
                expect( checkResourceTags(res, ["C", "B", "A"]) )
                    .equal(false);
                expect( checkResourceTags(res, ["Delta"]) )
                    .equal(false);
            });
        });
        
        describe("checkResourceTags(resource, ['-tag1', '-tag2', ...])", function() {
            it("should return true", function() {
                expect( checkResourceTags(res, ["-d"]) )
                    .equal(true);
                expect( checkResourceTags(res, ["-a", "-omega"]) )
                    .equal(true);
                expect( checkResourceTags(res, ["-a", "-b", "-c", "-delta", "-gamma"]) )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( checkResourceTags(res, ["-a"]) )
                    .equal(false);
                expect( checkResourceTags(res, ["-a", "-b"]) )
                    .equal(false);
                expect( checkResourceTags(res, ["-c", "-b", "-a"]) )
                    .equal(false);
                expect( checkResourceTags(res, ["-c", "-b", "-delta", "-a"]) )
                    .equal(false);
            });
        });
        
        describe("checkResourceTags(resource, ['tag1', 'tag2', '-tag3', '-tag4', ...])", function() {
            it("should return true", function() {
                expect( checkResourceTags(res, ["b", "-1"]) )
                    .equal(true);
                expect( checkResourceTags(res, ["delta", "-day", "-c"]) )
                    .equal(true);
                expect( checkResourceTags(res, ["a", "c", "-teta", "-eta"]) )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( checkResourceTags(res, ["A", "-b"]) )
                    .equal(false);
                expect( checkResourceTags(res, ["A", "bool", "-b", "-delta"]) )
                    .equal(false);
            });
        });
        
        describe("checkResourceTags(resource, tagList, true)", function() {
            it("should return true", function() {
                expect( checkResourceTags(resNoTag, [], true) )
                    .equal(true);
                expect( checkResourceTags(res, [], true) )
                    .equal(true);
                expect( checkResourceTags(res, ["a"], true) )
                    .equal(true);
                expect( checkResourceTags(res, ["b", "delta"], true) )
                    .equal(true);
                expect( checkResourceTags(res, ["delta", "a", "c", "b"], true) )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( checkResourceTags(resNoTag, ["a"], true) )
                    .equal(false);
                expect( checkResourceTags(res, ["a", "omega"], true) )
                    .equal(false);
                expect( checkResourceTags(res, ["delta", "c", "z"], true) )
                    .equal(false);
                expect( checkResourceTags(res, ["a", "Delta", "b"], true) )
                    .equal(false);
                expect( checkResourceTags(res, ["a", "b", "c", "delta", "gamma"], true) )
                    .equal(false);
            });
        });
        
        describe("checkResourceTags(resource, ['-tag1', '-tag2', ...], true)", function() {
            it("should return true", function() {
                expect( checkResourceTags(res, ["-x"], true) )
                    .equal(true);
                expect( checkResourceTags(res, ["-x", "-y", "-z"], true) )
                    .equal(true);
                expect( checkResourceTags(res, ["-1", "-2", "-3", "-A"], true) )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( checkResourceTags(res, ["-delta"], true) )
                    .equal(false);
                expect( checkResourceTags(res, ["-d", "-a"], true) )
                    .equal(false);
                expect( checkResourceTags(res, ["-b", "-X", "-v"], true) )
                    .equal(false);
                expect( checkResourceTags(res, ["-one", "-c", "-z", "-version"], true) )
                    .equal(false);
            });
        });
        
        describe("checkResourceTags(resource, ['tag1', 'tag2', '-tag3', '-tag4', ...], true)", function() {
            it("should return true", function() {
                expect( checkResourceTags(res, ["a", "-omega"], true) )
                    .equal(true);
                expect( checkResourceTags(res, ["a", "delta", "-d", "-f"], true) )
                    .equal(true);
                expect( checkResourceTags(res, ["a", "delta", "b", "c", "-i", "-j", "-k", "-last", "-chance"], true) )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( checkResourceTags(res, ["a", "-b"], true) )
                    .equal(false);
                expect( checkResourceTags(res, ["a", "b", "-c", "-d", "-e"], true) )
                    .equal(false);
                expect( checkResourceTags(res, ["a", "b", "c", "d", "-e", "-f", "-g"], true) )
                    .equal(false);
                expect( checkResourceTags(res, ["delta", "b", "c", "-quattro", "-x-drive", "-a"], true) )
                    .equal(false);
            });
        });
    });
    
    
    describe(".getList", function() {
        var getList = resource.getList;
        
        describe("getList()", function() {
            it("should return list of all available resources", function() {
                var resourceList = getList(),
                    sourceList = initialResourceList,
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
        
        describe("getList({selectName: 'name' | ['name1', 'name2', ...]})", function() {
            it("should return list of resources with specified names", function() {
                var resourceList = getList({selectName: "GitHub"}),
                    nameList, nI, nL;
                
                expect( resourceList )
                    .be["instanceof"](Array);
                expect( resourceList.length )
                    .equal(1);
                expect( resourceList[0].name.toLowerCase() )
                    .equal("github");
                
                resourceList = getList({selectName: ["NPM"]});
                
                expect( resourceList )
                    .be["instanceof"](Array);
                expect( resourceList.length )
                    .equal(1);
                expect( resourceList[0].name.toLowerCase() )
                    .equal("npm");
                
                resourceList = getList({selectName: ["BOWER", "Microjs"]});
                
                expect( resourceList )
                    .be["instanceof"](Array);
                expect( resourceList.length )
                    .equal(2);
                
                nameList = ["bower", "microjs"];
                for (nI = 0, nL = resourceList.length; nI < nL; nI++) {
                    expect( nameList.indexOf( resourceList[0].name.toLowerCase() ) )
                        .above(-1);
                    
                }
            });
            
            it("should return empty array", function() {
                var list = getList({selectName: new Date().toString()});
            
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
                
                list = getList({selectName: ["super-site", "extra-space", "alpha-beta-gamma"]});
                
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
            });
        });
        
        describe("getList({selectTag: 'tag' | ['tag1', 'tag2', ...]})", function() {
            it("should return list of resources with specified tags", function() {
                var resList, tags;
                
                tags = "project";
                resList = getList({selectTag: tags});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(1);
                expect( resList[0].name )
                    .equal("GitHub");
                
                tags = [];
                resList = getList({selectTag: tags});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(initialResourceList.length);
                
                resList = getList({selectTag: ["JS"]});
                checkResTags(resList, ["js"]);
                expect( resList.length )
                    .equal(4);
                
                tags = ["Node", "Browser"];
                resList = getList({selectTag: tags});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(3);
                
                tags = ["PACKAGE", "Library", "component"];
                resList = getList({selectTag: tags});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(4);
            });
            
            it("should return empty array", function() {
                var list = getList({selectTag: new Date().toString()});
            
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
                
                list = getList({selectTag: ["abcdefgh", "extra-fun", "hello world!"]});
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
            });
        });
        
        describe("getList({selectTag: ['tag1', '-tag2', ...]})", function() {
            it("should return list of resources filtered by tags", function() {
                var resList, tags;
                
                tags = ["Node", "-Plugin"];
                resList = getList({selectTag: tags});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(1);
                
                tags = ["js", "node", "-library"];
                resList = getList({selectTag: tags});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(1);
                
                tags = ["-Framework", "PACKAGE", "Library", "component"];
                resList = getList({selectTag: tags});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(2);
            });
            
            it("should return empty array", function() {
                var list = getList({selectTag: ["abc", "-node"]});
            
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
                
                list = getList({selectTag: ["component", "-browser"]});
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
            });
        });
        
        describe("getList({selectTag: 'tag' | ['tag1', 'tag2', ...], checkAllTags: true})", function() {
            it("should return list of resources with all specified tags", function() {
                var resList, tags;
                
                tags = "project";
                resList = getList({selectTag: tags, checkAllTags: true});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(1);
                expect( resList[0].name )
                    .equal("GitHub");
                
                tags = [];
                resList = getList({selectTag: tags, checkAllTags: true});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(initialResourceList.length);
                
                resList = getList({selectTag: ["JS"], checkAllTags: true});
                checkResTags(resList, ["js"]);
                expect( resList.length )
                    .equal(4);
                
                tags = ["Framework", "Library"];
                resList = getList({selectTag: tags, checkAllTags: true});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(2);
                
                tags = ["PACKAGE", "Library", "component"];
                resList = getList({selectTag: tags, checkAllTags: true});
                checkResTags(resList, tags);
                expect( resList.length )
                    .equal(1);
                expect( resList[0].name )
                    .equal("Bower");
            });
            
            it("should return empty array", function() {
                var list = getList({selectTag: new Date().toString(), checkAllTags: true});
            
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
                
                list = getList({selectTag: ["zyx", "extra-work", "hello space!"], checkAllTags: true});
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
                
                list = getList({selectTag: ["project", "php"], checkAllTags: true});
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
                
                list = getList({selectTag: ["Browser", "node"], checkAllTags: true});
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
                
                list = getList({selectTag: ["amd", "browser", "plugin"], checkAllTags: true});
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
            });
        });
        
        describe("getList({selectTag: ['tag1', '-tag2', ...], checkAllTags: true})", function() {
            it("should return list of resources filtered by tags", function() {
                var resList, tags;
                
                tags = ["JS", "Library", "Package", "-Amd"];
                resList = getList({selectTag: tags, checkAllTags: true});
                checkResTags(resList, tags, true);
                expect( resList.length )
                    .equal(2);
                
                tags = ["library", "framework", "-BROWSER", "-NODE"];
                resList = getList({selectTag: tags, checkAllTags: true});
                checkResTags(resList, tags, true);
                expect( resList.length )
                    .equal(2);
            });
            
            it("should return empty array", function() {
                var list = getList({selectTag: ["component", "-js"], checkAllTags: true});
            
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
                
                list = getList({selectTag: ["library", "framework", "package", "-project", "-component"], checkAllTags: true});
                expect( list )
                    .be["instanceof"](Array);
                expect( list.length )
                    .equal(0);
            });
        });
        
        describe("getList({selectName: 'name' | names, selectTag: 'tag' | tags, checkAllTags: true | false})", function() {
            it("should return list of resources with specified names or tags", function() {
                function checkResNames(settings, resultNames) {
                    var resList = getList(settings),
                        nL = resList.length,
                        nI;
                    
                    if (Array.isArray(resultNames)) {
                        resultNames = resultNames.map(toLowerCase);
                    }
                    else {
                        resultNames = [resultNames.toLowerCase()];
                    }
                    
                    expect( nL )
                        .equal(resultNames.length);
                    for (nI = 0; nI < nL; nI++) {
                        expect( resultNames.indexOf(resList[nI].name.toLowerCase()) )
                            .above(-1);
                    }
                }
                
                checkResNames({selectName: "Github", selectTag: "project"}, "GitHub");
                checkResNames({selectName: "Github", selectTag: "package"}, 
                                ["GitHub", "npm", "Bower"]);
                checkResNames({selectName: "Github", selectTag: ["library", "component"]}, 
                                ["GitHub", "npm", "Bower", "MicroJS"]);
                checkResNames({selectName: ["Github", "Grunt"], selectTag: "node"}, 
                                ["GitHub", "Npm", "Grunt"]);
                checkResNames({selectName: ["Grunt"], selectTag: ["framework", "library"]}, 
                                ["GitHub", "Grunt", "NPM", "Bower", "MicroJS"]);
                
                checkResNames({selectName: "Grunt", selectTag: ["library", "package"], checkAllTags: true}, 
                                ["NPM", "Bower", "Grunt", "Github"]);
                checkResNames({selectName: ["Grunt", "MicroJS"], selectTag: ["browser", "component"], checkAllTags: true}, 
                                ["Bower", "Grunt", "MicroJS"]);
            });
            
            it("should return empty array", function() {
                expect( getList({selectName: "abc", selectTag: "_______"}).length )
                    .equal(0);
                expect( getList({selectName: ["a", "b", "c"], selectTag: ["d", "e"]}).length )
                    .equal(0);
                expect( getList({selectName: "unknown", selectTag: ["amd", "node"], checkAllTags: true}).length )
                    .equal(0);
                expect( getList({selectName: ["super", "resource"], selectTag: ["project", "lib"], checkAllTags: true}).length )
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
                
                check( getList({selectName: ["bower", "Github"], includeApi: true}) );
            });
        });
        
    });
    
    
    describe(".setList", function() {
        var setList = resource.setList;
        
        describe("setList([])", function() {
            it("should remove all resources", function() {
                setList([]);
                
                expect( resource.getList() )
                    .have.length(0);
            });
        });
        
        describe("setList(list)", function() {
            it("should change list of available resources", function() {
                var oldList = resource.getList(),
                    resourceList;
                
                expect( oldList )
                    .have.length.above(0);
                
                setList([
                         {
                             name: "res1",
                             module: "path/to/res1"
                         },
                         {
                             name: "res2",
                             module: "path/to/res2"
                         }
                         ]);
                
                resourceList = resource.getList();
                expect( resourceList )
                    .have.length(2);
                expect( resourceList )
                    .not.eql(oldList);
                
                checkResourcePresence("res1");
                checkResourcePresence("res2");
            });
        });
        
        describe("setList(resource)", function() {
            it("should set list of available resources to one-item list", function() {
                var res = {
                        name: "res",
                        module: "path/to/res1"
                    },
                    resourceList;
                
                setList(res);
                
                resourceList = resource.getList();
                expect( resourceList )
                    .have.length(1);
                expect( resourceList[0] )
                    .have.property("name", res.name);
                expect( resourceList[0] )
                    .have.property("module", res.module);
                
                checkResourcePresence(res.name);
            });
        });
    });
    
    
    describe(".filterList(settings)", function() {
        function checkResNames(settings, resultNames) {
            var list = filterList(settings).getList(),
                nL = list.length,
                nI;
            
            if (Array.isArray(resultNames)) {
                resultNames = resultNames.map(toLowerCase);
            }
            else {
                resultNames = [resultNames.toLowerCase()];
            }
            
            expect( list )
                .instanceOf(Array);
            expect( nL )
                .equal(resultNames.length);
            for (nI = 0; nI < nL; nI++) {
                expect( resultNames.indexOf(list[nI].name.toLowerCase()) )
                    .above(-1);
            }
        }
        
        var filterList = resource.filterList;
        
        it("should filter list of available resources", function() {
            checkResNames({selectTag: "package"}, ["Github", "Npm", "Bower"]);
            checkResNames({selectTag: "library"}, ["Github", "Npm", "Bower"]);
            checkResNames({selectTag: ["node", "browser"]}, ["Npm", "Bower"]);
            checkResNames({selectTag: "node"}, ["Npm"]);
            checkResNames({selectTag: "pro"}, []);
            
            resource.resetList();
            
            checkResNames({selectName: ["Github", "Microjs"], selectTag: ["package", "browser"], checkAllTags: true}, 
                            ["Github", "Bower", "Microjs"]);
            checkResNames({selectName: ["GitHub"], selectTag: ["js", "library"], checkAllTags: true}, 
                            ["GitHub", "Bower", "Microjs"]);
            checkResNames({selectName: "Bower", selectTag: ["package", "component"], checkAllTags: true}, 
                            ["Bower"]);
            checkResNames({selectName: "Fruit", selectTag: ["amd", "project"], checkAllTags: true}, 
                            []);
        });
    });
    
    
    describe(".getMap", function() {
        function checkResNames(settings, resultNames) {
            var resMap = getMap(settings),
                nK = 0,
                sId;
            
            if (Array.isArray(resultNames)) {
                resultNames = resultNames.map(toLowerCase);
            }
            else {
                resultNames = [resultNames.toLowerCase()];
            }
            
            expect( resMap )
                .an("object");
            for (sId in resMap) {
                expect( resultNames.indexOf(resMap[sId].name.toLowerCase()) )
                    .above(-1);
                nK++;
            }
            expect( nK )
                .equal(resultNames.length);
        }
        
        var getMap = resource.getMap;
        
        describe("getMap()", function() {
            it("should return object containing data about all available resources", function() {
                var resourceMap = getMap(),
                    sourceList = initialResourceList,
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
        
        describe("getMap({selectName: 'name' | ['name1', 'name2', ...]})", function() {
            it("should return object containing data about resources with specified names", function() {
                
                function check(names) {
                    checkResNames({selectName: names}, names);
                }
                
                check("npm");
                
                check(["GitHub", "microJS"]);
                
                check(["NPM", "bower"]);
            });
            
            it("should return empty object", function() {
                /*jshint expr:true*/
                expect( getMap({selectName: new Date().toString()}) )
                    .empty;
                
                expect( getMap({selectName: ["a", "b", "c", "z"]}) )
                    .empty;
            });
        });
        
        describe("getMap({selectTag: 'tag' | ['tag1', 'tag2', ...]})", function() {
            it("should return object containing data about resources with specified tags", function() {
                checkResNames({selectTag: []}, ["Github", "Npm", "Bower", "Grunt", "MicroJS"]);
                checkResNames({selectTag: ["JS"]}, ["Npm", "Bower", "Grunt", "MicroJS"]);
                checkResNames({selectTag: ["project", "Component"]}, ["Github", "Bower"]);
                checkResNames({selectTag: ["project", "amd", "micro"]}, ["Github", "microjs"]);
            });
            
            it("should return empty object", function() {
                checkResNames({selectTag: ["projects"]}, []);
                checkResNames({selectTag: ["space", "adventure"]}, []);
            });
        });
        
        describe("getMap({selectTag: 'tag' | ['tag1', 'tag2', ...], checkAllTags: true})", function() {
            it("should return object containing data about resources with all specified tags", function() {
                checkResNames({selectTag: [], checkAllTags: true}, 
                                ["Github", "Npm", "Bower", "Grunt", "MicroJS"]);
                checkResNames({selectTag: ["JS"], checkAllTags: true}, 
                                ["Npm", "Bower", "Grunt", "MicroJS"]);
                checkResNames({selectTag: ["library", "Component"], checkAllTags: true}, 
                                ["Bower"]);
                checkResNames({selectTag: ["library", "framework"], checkAllTags: true}, 
                                ["Microjs", "Github"]);
            });
            
            it("should return empty object", function() {
                checkResNames({selectTag: ["lib"], checkAllTags: true}, []);
                checkResNames({selectTag: ["project", "component"], checkAllTags: true}, []);
                checkResNames({selectTag: ["js", "registry", "library"], checkAllTags: true}, []);
            });
        });
        
        describe("getMap({selectName: 'name' | ['name1', 'name2', ...], selectTag: 'tag' | ['tag1', 'tag2', ...], checkAllTags: true | false})", function() {
            it("should return object containing data about resources with specified names or tags", function() {
                checkResNames({selectName: "Grunt", selectTag: "micro"}, 
                                ["Grunt", "MicroJS"]);
                checkResNames({selectName: ["Npm", "MicroJs"], selectTag: ["plugin", "project"]}, 
                                ["GitHub", "Npm", "Grunt", "MicroJS"]);
                checkResNames({selectName: ["Bower"], selectTag: ["library", "project"], checkAllTags: true}, 
                                ["GitHub", "Bower"]);
            });
            
            it("should return empty object", function() {
                checkResNames({selectName: "Gulp", selectTag: ["lib"]}, []);
                checkResNames({selectName: ["Babylon", "5"], selectTag: ["pro", "contra"]}, []);
                checkResNames({selectName: ["a", "b", "c"], selectTag: ["java", "registry", "portal"], checkAllTags: true}, []);
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
                
                check( getMap({selectName: ["npm", "BOWER"], includeApi: true}) );
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
            
            after(function() {
                checkResourceAbsence(sName);
            });
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
            expect( a({name: "BOWER", api: {}}) )
                .to["throw"](/duplicate name/i);
        });
    });
    
    
    describe(".remove(name)", function() {
        var remove = resource.remove;
        
        it("should remove resource with given name from list of resources", function() {
            var list = resource.getAllNameList(),
                nL = list.length,
                nI, result,  sName;
            
            expect( nL )
                .above(0);
            
            for (nI = 0; nI < nL; nI++) {
                sName = list[nI];
                checkResourcePresence(sName);
                
                result = remove(sName);
                
                expect( result )
                    .not.be.a("null");
                expect( result )
                    .be.an("object");
                expect( result.name )
                    .equal(sName);
                
                checkResourceAbsence(sName);
                expect( resource.getList().length )
                    .equal(nL - nI - 1);
            }
            expect( resource.getMap() )
                .deep.equal({});
        });
        
        it("should not remove anything", function() {
            var sourceList = resource.getList(),
                nL = sourceList.length,
                resourceMap = resource.getMap(),
                list;
            
            expect( nL )
                .above(0);
            
            expect( remove("res-" + new Date().getTime()) )
                .equal(null);
            
            expect( remove("Some Non-Existent Resource") )
                .equal(null);
            
            list = resource.getList();
            expect( list.length )
                .equal(nL);
            expect( list )
                .deep.equal(sourceList);
            expect( resource.getMap() )
                .deep.equal(resourceMap);
        });
    });
    
    
    describe(".removeAll()", function() {
        var removeAll = resource.removeAll;
        
        it("should remove all resources from list", function() {
            var list = resource.getAllNameList(),
                nL = list.length,
                nI;
            
            expect( nL )
                .above(0);
            
            removeAll();
            
            for (nI = 0; nI < nL; nI++) {
                checkResourceAbsence(list[nI]);
            }
            
            list = resource.getList();
            expect( list )
                .eql([]);
        });
    });
    
    
    describe(".resetList()", function() {
        it("should set list of resources to initial state", function() {
            var list = resource.getList(),
                map = resource.getMap(),
                sName = "resource at " + new Date().getTime(),
                result;
            
            checkResourceAbsence(sName);
            
            resource.add({name: sName, module: "some/path"});
            
            checkResourcePresence(sName);
            
            result = resource.resetList();
            
            checkResourceAbsence(sName);
            expect( result )
                .equal(resource);
            expect( resource.getList() )
                .eql(list);
            expect( resource.getMap() )
                .eql(map);
        });
    });
    
    
    describe(".initList()", function() {
        var initList = resource.initList,
            sourceList = resource.getList();
        
        afterEach(function() {
            initList(sourceList);
        });
        
        it("should set initial list of available resources", function() {
            var sName = "resource at " + new Date().getTime(),
                sName2 = sName + "_",
                res = {name: sName, module: "some/path"},
                res2 = {name: sName2, module: "some/path2"},
                result;
            
            checkResourceAbsence(sName);
            resource.add(res);
            checkResourcePresence(sName);
            
            initList(sourceList);
            expect( resource.getList() )
                .eql(sourceList);
            
            initList(res);
            checkResourcePresence(sName);
            expect( resource.getAllNameList() )
                .eql([sName]);
            
            resource.add(res2);
            checkResourcePresence(sName2);
            resource.resetList();
            expect( resource.getAllNameList() )
                .eql([sName]);
            
            result = initList([res, res2]);
            checkResourcePresence(sName);
            checkResourcePresence(sName2);
            expect( resource.getAllNameList() )
                .eql([sName, sName2]);
            expect( result )
                .equal(resource);
        });
    });
});

/**
 * Command-line interface.
 * 
 * @module cli
 */

/*jshint boss:true, latedef:false, laxbreak:true*/


function resourceListToString(resourceList) {
    var result = ["\nAvailable resources:\n"],
        sIndent = "    ",
        nI, nK, resource;
    for (nI = 0, nK = resourceList.length; nI < nK; nI++) {
        resource = resourceList[nI];
        result.push("\n",
                    sIndent, resource.name, " - ", resource.description, "\n",
                    sIndent, "url: ", resource.url, "\n",
                    sIndent, "tags: ", resource.tag.join(" "), "\n");
        if (resource.note) {
            result.push(sIndent, resource.note, "\n");
        }
    }
    return result.join("");
}


function showProgress(data) {
    var sOut = [data.number, "/", data.total, " (", Math.floor(data.number * 100 / data.total), "%)"].join("");
    charm.left(showProgress.shift);
    charm.write(sOut);
    showProgress.shift = sOut.length;
    if (data.number === data.total) {
        charm.write("\n");
    }
}
showProgress.shift = 3;


function licenseToString(license) {
    var result = [],
        item, nI, nL;
    if (! Array.isArray(license)) {
        license = [license];
    }
    for (nI = 0, nL = license.length; nI < nL; nI++) {
        item = license[nI];
        if (typeof item === "object" && item.type) {
            item = item.type;
        }
        result.push(item);
    }
    return result.join(", ");
}


function showResult(resultMap) {
    /*jshint expr:true*/
    var bVerbose = args.verbose,
        out = ["\nResults:"], 
        sIndent = "    ",
        sIndentTwice = "        ",
        nameResult, nI, nK, nN, nQ, sName, sResourceName, resourceResult, resourceResultList, result, value;
    
    for (nI = 0, nK = nameList.length; nI < nK; nI++) {
        sName = nameList[nI];
        out.push("\n\n", nI + 1, ". ", sName);
        
        nameResult = resultMap[sName];
        for (sResourceName in nameResult) {
            out.push("\n\n", sIndent, sResourceName);
            resourceResult = nameResult[sResourceName];
            resourceResultList = resourceResult.result;
            nQ = resourceResultList.length;
            if (nQ) {
                out.push(" - ", nQ);
                for (nN = 0; nN < nQ; nN++) {
                    result = resourceResultList[nN];
                    nN &&
                        out.push("\n");
                    
                    out.push("\n", sIndentTwice, result.name);
                    result.description &&
                        out.push(" - ", result.description);
                    (value = result.url || result.homepage) &&
                        out.push("\n", sIndentTwice, "url: ", value);
                    (value = result.keywords) && value.length &&
                        out.push("\n", sIndentTwice, "keywords: ", value.join(" "));
                    
                    if (bVerbose) {
                        result.version &&
                            out.push("\n", sIndentTwice, "version: ", result.version);
                        if (value = result.repo || result.repository) {
                            if (typeof value === "object") {
                                value = value.url;
                            }
                            value &&
                                out.push("\n", sIndentTwice, "repository: ", value);
                        }
                        result.language &&
                            out.push("\n", sIndentTwice, "language: ", result.language);
                        (value = result.license || result.licence) &&
                            out.push("\n", sIndentTwice, "license: ", licenseToString(value));
                        result.stars &&
                            out.push("\n", sIndentTwice, "stars: ", result.stars);
                    }
                }
            }
            else {
                out.push("\n", sIndentTwice, sName, " is not found.");
                resourceResult.error &&
                    out.push("\n", sIndentTwice, "Error of checking '", sName, "' at '", sResourceName, "': ", resourceResult.error);
            }
        }
        
    }
    console.log(out.join(""));
}


var fs = require("fs"),
    
    charm = require("charm")(),
    nomnom = require("nomnom"),
    
    resourceUnit = require("./resource"),
    seeq = require("./seeq"),
    
    bShowUsage = true,
    pkg = JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8")),
    resourceList = resourceUnit.getList({includeApi: true}),
    sResourceListInfo = resourceListToString(resourceList),
    generalSettingName = {
        "partialMatch": null, 
        "caseSensitive": null, 
        "search": null, 
        "limit": null
    },
    nameList,
    resourceNameList,
    resourceSettings,
    list,
    nI,
    nL,
    sMessage,
    sName,
    value,
    
    argParser = nomnom(),
    args = argParser
                .script(pkg.name)
                .options({
                    "name": {
                        position: 0,
                        list: true,
                        help: "Name/string that should be searched for or checked for presence on a resource"
                    },
                    "help": {
                        abbr: "h",
                        help: "Show usage information and exit"
                    },
                    "resource": {
                        abbr: "r",
                        full: "at",
                        help: "Comma-separated list of names (case-insensitive) of resources that should be checked/searched; all resources by default"
                    },
                    "listResource": {
                        abbr: "l",
                        full: "list-resource",
                        flag: true,
                        help: "Show information about all available resources"
                    },
                    "partialMatch": {
                        abbr: "p",
                        full: "partial-match",
                        help: "Allow partial matching when checking name: 0 - disallow (by default), 1 - allow at the beginning of matching strings, 2 - allow substring matching",
                        choices: [0, 1, 2]
                    },
                    "caseSensitive": {
                        abbr: "c",
                        full: "case-sensitive",
                        flag: true,
                        help: "Use case-sensitive check/search when possible"
                    },
                    "search": {
                        abbr: "s",
                        flag: true,
                        help: "Make search instead of check"
                    },
                    "limit": {
                        help: "Limit of quantity of results per resource",
                        callback: function(value) {
                            if (value < 1) {
                                return "Limit should be equal to or greater than 1";
                            }
                        }
                    },
                    "verbose": {
                        abbr: "V",
                        flag: true,
                        help: "Enable verbose output"
                    },
                    "version": {
                        abbr: "v",
                        flag: true,
                        help: "Show program version"
                    }
                })
                .help(sResourceListInfo);


// Add options of resources
for (nI = 0, nL = resourceList.length; nI < nL; nI++) {
    value = resourceList[nI];
    if (list = value.api.settings) {
        sName = value.id;
        for (value in list) {
            args.option(sName + "-" + value, list[value]);
        }
    }
}

// Parse arguments
args = args.parse();

if (args.version) {
    console.log("Version: " + pkg.version);
    bShowUsage = false;
}

if (args.listResource) {
    console.log(sResourceListInfo);
    bShowUsage = false;
}

if (args.name && args.name.length) {
    // List of names to check
    nameList = args.name;
    // Determine resources to check
    if (args.resource) {
        list = [];
        resourceNameList = args.resource.split(",").filter(function(name) {
            if (resourceUnit.isAvailable(name)) {
                return true;
            }
            list.push(name);
            return false;
        });
        if (resourceNameList.length) {
            sMessage = resourceNameList.join(", ");
        }
        if (nI = list.length) {
            console.log(nI > 1
                            ? "The following resources are unknown: " + list.join(", ")
                            : list[0] + " is unknown resource");
        }
    }
    else {
        sMessage = resourceUnit.getAllNameList().join(", ");
    }
    // Make check if resources are specified
    if (sMessage) {
        // Prepare resources settings
        resourceSettings = {
        };
        for (sName in args) {
            value = args[sName];
            // General settings
            if (sName in generalSettingName) {
                (resourceSettings._general || (resourceSettings._general = {}))[sName] = value;
            }
            // Resource-specific settings
            else if (list = /^(\w+)\-(.+)$/.exec(sName)) {
                if (sName = resourceUnit.getIdByName(list[1])) {
                    ( resourceSettings[sName] || (resourceSettings[sName] = {}) )[ list[2] ] = value;
                }
            }
        }
        // Start checking
        console.log("Checking " + sMessage + "...");
        if (nameList.length > 1 || (resourceNameList || resourceList).length > 1) {
            value = showProgress;
            charm.pipe(process.stdout);
            charm.write("Progress: 0 %");
        }
        else {
            value = null;
        }
        seeq.search(nameList, showResult, 
                    {
                        resource: resourceNameList, 
                        settings: resourceSettings,
                        progressCallback: value
                    });
    }
}
else if (bShowUsage) {
    argParser.print(argParser.getUsage());
}

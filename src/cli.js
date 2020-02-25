/**
 * Command-line interface.
 * 
 * @module cli
 */

/*jshint boss:true, laxbreak:true*/


function resourceListToString(resourceList, short) {
    var nK = resourceList.length,
        result = ["\nAvailable resources (", nK, "):\n"],
        sIndent = "    ",
        nI, resource;
    for (nI = 0; nI < nK; nI++) {
        resource = resourceList[nI];
        if (short) {
            result.push("\n",
                    sIndent, "* ", resource.name, " (", resource.url, ") - ", resource.shortDescr,
                    " (tags: ", resource.tag.join(" "), ")"
                    );
        }
        else {
            result.push("\n",
                    sIndent, resource.name, " - ", resource.description, "\n",
                    sIndent, "url: ", resource.url, "\n",
                    sIndent, "tags: ", resource.tag.join(" "), "\n");
            if (resource.note) {
                result.push(sIndent, resource.note, "\n");
            }
        }
    }
    return result.join("");
}


var fs = require("fs"),
    
    charm = require("charm")(),
    nomnom = require("nomnom"),
    
    formatUnit = require("./format"),
    resourceUnit = require("./resource"),
    seeq = require("./seeq"),
    
    pkg = JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8")),
    resourceList = resourceUnit.getList({includeApi: true}),
    generalSettingName = {
        "partialMatch": null,
        "caseSensitive": null,
        "search": null,
        "limit": null,
        "requestTimeout": null
    },
    
    argParser = nomnom()
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
                        "listResource": {
                            abbr: "l",
                            full: "list-resource",
                            flag: true,
                            help: "Show information about all available resources"
                        },
                        "resource": {
                            abbr: "r",
                            full: "at",
                            help: "Filter for available resources by name: comma-separated list of names (case-insensitive) of resources that should be checked/searched"
                        },
                        "resourceTag": {
                            abbr: "t",
                            full: "tag",
                            help: "Filter for available resources by tag: comma-separated list of tags (case-insensitive); -tag means that resource should not have the tag"
                        },
                        "checkAllTags": {
                            full: "all-tag",
                            flag: true,
                            help: "Whether all specified tags should be checked for a resource"
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
                            abbr: "m",
                            help: "Limit of quantity of results per resource",
                            callback: function(value) {
                                if (value < 1) {
                                    return "Limit should be equal to or greater than 1";
                                }
                            }
                        },
                        "requestTimeout": {
                            full: "timeout",
                            "default": 60,
                            help: "Number of seconds to wait for a response before aborting a data request to a resource"
                        },
                        "format": {
                            abbr: "f",
                            "default": formatUnit.exists("text") ? "text" : "raw",
                            help: "Result format; can be: " + formatUnit.getNameList().join(", ")
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
                    .help(resourceListToString(resourceList, true));


(function() {
    var nI, nL, settings, sName, value;
    // Add options of resources
    for (nI = 0, nL = resourceList.length; nI < nL; nI++) {
        value = resourceList[nI];
        if (settings = value.api.settings) {
            sName = value.id;
            for (value in settings) {
                argParser.option(sName + "-" + value, settings[value]);
            }
        }
    }
}());


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


function showResult(resultMap, nameList, args) {
    var sFormat = args.format,
        result = sFormat ? formatUnit.exists(sFormat) : false;
    if (result) {
        result = formatUnit.format(resultMap, 
                                    sFormat,
                                    {
                                        queryList: nameList,
                                        verbose: args.verbose
                                    });
    }
    else {
        result = JSON.stringify(resultMap, null, 4);
    }
    console.log("\nResults:\n\n" + result);
}


/**
 * Perform operation using specified options.
 * 
 * @param {Object} [args]
 *      Operation options.
 * @alias module:cli.run
 */
function run(args) {
    var bShowUsage = true,
        list,
        nameList,
        nL,
        resourceNameList,
        resourceSettings,
        sName,
        value;
    
    if (! args) {
        args = {};
    }
    
    if (args.version) {
        console.log("Version: " + pkg.version);
        bShowUsage = false;
    }
    
    if (args.listResource) {
        console.log(resourceListToString(resourceList));
        bShowUsage = false;
    }
    
    if (args.name && args.name.length) {
        // List of names to check
        nameList = args.name;
        // Determine resources to check
        if (args.resource) {
            args.resource = args.resource.split(",");
        }
        if (args.resourceTag) {
            args.resourceTag = args.resourceTag.split(",");
        }
        resourceNameList = resourceUnit.getNameList({
                                                        selectName: args.resource, 
                                                        selectTag: args.resourceTag,
                                                        checkAllTags: args.checkAllTags
                                                    });
        // Make check if resources are specified
        if (resourceNameList.length) {
            // Prepare resources settings
            resourceSettings = {
            };
            for (sName in args) {
                value = args[sName];
                // General settings
                if (sName in generalSettingName) {
                    if (sName === "requestTimeout") {
                        value *= 1000;
                    }
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
            console.log("Checking " + resourceNameList.join(", ") + "...");
            if (nameList.length > 1 || resourceNameList.length > 1) {
                value = showProgress;
                charm.pipe(process.stdout);
                charm.write("Progress: 0 %");
            }
            else {
                value = null;
            }
            seeq.search(nameList, 
                        function(resultMap) {
                            showResult(resultMap, nameList, args);
                        },
                        {
                            resource: resourceNameList, 
                            settings: resourceSettings,
                            progressCallback: value
                        });
        }
        // If no resource is found
        else {
            console.log("No resource is found.");
            if (args.resource) {
                list = args.resource.filter(function(name) {
                    return ! resourceUnit.isAvailable(name);
                });
                if (nL = list.length) {
                    console.log(nL > 1
                                    ? "The following resources are unknown: " + list.join(", ")
                                    : list[0] + " is unknown resource");
                }
            }
            console.log("Run `" + pkg.name + " -l` to see information about all available resources.");
        }
    }
    else if (bShowUsage) {
        argParser.print(argParser.getUsage());
    }
}


/**
 * Perform operation specified via command-line arguments.
 * 
 * @param {Object} [options]
 *      Predefined values for command-line options.
 *      Each option specified in this object will be used only when the corresponding option is not set in command-line arguments.
 * @alias module:cli.cli
 * @see {@link module:cli.run run}
 */
function cli(options) {
    var args = argParser.parse(),
        optionMap,
        sName,
        value;
    
    // Use predefined values for absent arguments
    if (options) {
        optionMap = argParser.specs;
        for (sName in optionMap) {
            if (! (sName in args)) {
                if (sName in options) {
                    args[sName] = options[sName];
                }
                else {
                    value = optionMap[sName];
                    if (value.full in options) {
                        args[sName] = options[value.full];
                    }
                    else if (value.abbr in options) {
                        args[sName] = options[value.abbr];
                    }
                }
            }
        }
    }
    // Run CLI
    run(args);
}


// Exports

exports.cli = cli;
exports.run = run;


// If script is run directly from Node
if (require.main === module) {
    cli();
}

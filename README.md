# seeq

Detect whether a name is registered or present on some resource ([GitHub](https://github.com), [NPM](https://npmjs.org),
[Bower](http://bower.io), ...).

Also allows searching for string on specified resources.

[![NPM version](https://badge.fury.io/js/seeq.png)](http://badge.fury.io/js/seeq)
[![Build Status](https://travis-ci.org/gamtiq/seeq.png)](https://travis-ci.org/gamtiq/seeq)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Available resources

The following resources are available:

* [GitHub](https://github.com)
* [NPM](https://npmjs.org)
* [Bower](http://bower.io)
* [Registry of Grunt plugins](http://gruntjs.com/plugins)
* [Registry of Gulp plugins](http://gulpjs.com/plugins)
* [JSter](http://jster.net)
* [MicroJS](http://microjs.com)
* [CDNJS](http://cdnjs.com)
* [Web components](https://www.webcomponents.org)

You can see information about all available resources by running `seeq -l` (see below).

## Installation

To install and use seeq [Node.js](http://nodejs.org) should be installed in your system.
Run the following command to install seeq:

    npm install -g seeq

## Usage

Run `seeq` to show usage information.

```
> seeq

Usage: seeq [name]... [options]

name     Name/string that should be searched for or checked for presence on a resource

Options:
   -h, --help             Show usage information and exit
   -l, --list-resource    Show information about all available resources
   -r, --at               Filter for available resources by name: comma-separated list of names (case-insensitive) of resources that should be checked/searched
   -t, --tag              Filter for available resources by tag: comma-separated list of tags (case-insensitive); -tag means that resource should not have the tag
   --all-tag              Whether all specified tags should be checked for a resource
   -p, --partial-match    Allow partial matching when checking name: 0 - disallow (by default), 1 - allow at the beginning of matching strings, 2 - allow substring matching
   -c, --case-sensitive   Use case-sensitive check/search when possible
   -s, --search           Make search instead of check
   -m, --limit            Limit of quantity of results per resource
   --timeout              Number of seconds to wait for a response before aborting a data request to a resource  [60]
   -f, --format           Result format; can be: text, json, markdown, raw  [text]
   -V, --verbose          Enable verbose output
   -v, --version          Show program version
   --github-lang          Search GitHub repositories that are written in the specified language
   --github-limit         Limit of quantity of GitHub results; default and maximum value is 100
   --github-user          GitHub username that should be used for authentication
   --github-password      GitHub account password
   --github-token         GitHub OAuth2 token that should be used for authentication instead of username and password


Available resources (9):

    * GitHub (https://github.com) - GitHub repositories
    * NPM (https://npmjs.org) - Node packaged modules registry
    * Bower (http://bower.io) - Bower package manager registry
    * Grunt (http://gruntjs.com/plugins) - Registry of Grunt plugins
    * Gulp (http://gulpjs.com/plugins/) - Registry of Gulp plugins
    * JSter (http://jster.net) - Catalog of JavaScript libraries and tools for web development
    * MicroJS (http://microjs.com) - List of micro-frameworks and micro-libraries
    * CDNJS (http://cdnjs.com) - Content Distribution Network for popular web development frameworks, libraries, CSS and other web assets
    * Web components (https://www.webcomponents.org) - Share and discover reusable web UI components. A long-term project committed to making the web better by sharing peer-reviewed custom elements that are usable across all browsers, and interoperable with existing libraries.
```

To make a search you can use `sees` command (`sees` equals to `seeq -s`).

### Formats

It is possible to specify format of search result:

* `text` - result will be converted into plain text; default format
* `json` - result will be converted into JSON
* `markdown` - result will be converted into [Markdown](http://daringfireball.net/projects/markdown/)
* `raw` - result will be returned "as is" (raw JSON): in usual mode auxiliary data about resources will be deleted, 
in verbose mode no processing will be applied

### Examples

Check `numgen`, `three` and `some-strange-name` at resources having `package` tag and limit results per resource up to 5.

```
> seeq numgen three some-strange-name --tag package --limit 5
Checking GitHub, NPM, Bower...
Progress: 9/9 (100%)

Results:

1. numgen

    GitHub - 5
        numgen - Creates objects that generate number sequences
        url: https://github.com/gamtiq/numgen

        numgen - doerp
        url: https://github.com/drmarduk/numgen

        numgen
        url: https://github.com/shubham-s-del/numgen

        numgen
        url: https://github.com/c3er/numgen

        Numgen - Maven Integration to Jenkins
        url: https://github.com/rajapaladugula/Numgen

    NPM - 1
        numgen - Creates objects that generate number sequences
        url: https://github.com/gamtiq/numgen
        keywords: number sequence generator

    Bower - 1
        numgen - Creates objects that generate number sequences
        url: https://github.com/gamtiq/numgen
        keywords: number sequence generator

2. three

    GitHub - 5
        three - Totally not inspired Rust 3D library
        url: https://github.com/three-rs/three

        three - An easy-to-use Python wrapper for the Open311 API.
        url: three.codeforamerica.org

        three - A GPL (v2) and Creative Commons (for the assets) game for the ioquake3 engine.
        url: http://www.ioquake3.org/

        three - Three.js component
        url: https://github.com/cvdlab/three

        Three
        url: https://github.com/saxocellphone/Three

    NPM - 1
        three - JavaScript 3D library
        url: http://threejs.org/
        keywords: three three.js 3d webgl

    Bower - 1
        three - JavaScript 3D library
        url: http://threejs.org/
        keywords: three threejs three.js 3D webgl

3. some-strange-name

    GitHub
        some-strange-name is not found.

    NPM
        some-strange-name is not found.

    Bower
        some-strange-name is not found.
```

Check `mixing` and `flight` at GitHub and Bower, allow partial matching at the beginning, use case-sensitive search,
limit Bower results up to 3 and GitHub results up to 5, include only GitHub projects that are written in JavaScript,
show additional information about found items.

```
> seeq mixing flight -r github,bower --partial-match 1 -c --bower-limit 3 --github-limit 5 --github-lang js --verbose
Checking GitHub, Bower...
Progress: 4/4 (100%)

Results:

1. mixing

    GitHub - 5
        mixing - Functions to mix, filter, change and copy/clone objects
        url: https://github.com/gamtiq/mixing
        repository: https://github.com/gamtiq/mixing.git
        language: JavaScript
        stars: 12

        mixingMachine - program for new machines
        url: https://github.com/heidgera/mixingMachine
        repository: https://github.com/heidgera/mixingMachine.git
        language: JavaScript

        mixing-desk - Simple mixing desk app used in a Digital Surgeons blog article.
        url: https://github.com/chambaz/mixing-desk
        repository: https://github.com/chambaz/mixing-desk.git
        language: JavaScript
        stars: 1

        mixing-web - Build web apps with webpack,vue,react,es6,and so on,??webpack?????vue,react???
        url: https://github.com/havefive/mixing-web
        repository: https://github.com/havefive/mixing-web.git
        language: JavaScript
        stars: 1

        mixingloom-profiler-example - an example of profiling by mixingloom-profiler
        url: https://github.com/wighawag/mixingloom-profiler-example
        repository: https://github.com/wighawag/mixingloom-profiler-example.git
        language: JavaScript
        stars: 2

    Bower - 2
        mixing - Functions to mix, filter, change and copy/clone objects
        url: https://github.com/gamtiq/mixing
        keywords: mix merge mixin object filter map change copy clone update
        version: 1.2.1
        repository: https://github.com/gamtiq/mixing.git
        license: MIT

        mixings
        url: https://github.com/sebastian-yabiku/mixings
        repository: https://github.com/sebastian-yabiku/mixings.git

2. flight

    GitHub - 5
        flight - A component-based, event-driven JavaScript framework from Twitter
        url: http://flightjs.github.io/
        repository: https://github.com/flightjs/flight.git
        language: JavaScript
        stars: 6620

        flightplan - Run sequences of shell commands against local and remote hosts.
        url: https://www.npmjs.com/package/flightplan
        repository: https://github.com/pstadler/flightplan.git
        language: JavaScript
        stars: 1621

        flightDelay - FlightDelay Project
        url: https://github.com/etherisc/flightDelay
        repository: https://github.com/etherisc/flightDelay.git
        language: JavaScript
        stars: 41

        flight627 - prototype work towards cloud-based developer tooling
        url: https://github.com/spring-projects/flight627
        repository: https://github.com/spring-projects/flight627.git
        language: JavaScript
        stars: 49

        flight - flight-framework is a jsfl script framework with a CommonJS-like module mechanism.
        url: https://github.com/uzzu/flight
        repository: https://github.com/uzzu/flight.git
        language: JavaScript
        stars: 5

    Bower - 3
        flight - Clientside component infrastructure
        url: https://github.com/flightjs/flight
        version: 1.5.1
        repository: https://github.com/flightjs/flight.git

        flight-yql
        url: https://github.com/msecret/flight-yql
        version: 0.2.2
        repository: https://github.com/msecret/flight-yql.git

        flight-edge
        url: https://github.com/cameronhunter/flight-edge
        version: 0.1.1
        repository: https://github.com/cameronhunter/flight-edge.git
```

Search for `pegasus` at resources that have tag `library` and do not have tags `node` and `cdn`,
limit results per resource up to 5, print the search result in JSON format.

```
> sees pegasus -m 5 --tag library,-node,-cdn --all-tag -f json
Checking GitHub, Bower, JSter, MicroJS...
Progress: 4/4 (100%)

Results:

{
    "pegasus": {
        "GitHub": {
            "result": [
                {
                    "name": "pegasus",
                    "description": "Load JSON while still loading other scripts",
                    "url": "http://typicode.github.io/pegasus/"
                },
                {
                    "name": "pegasus",
                    "url": "https://github.com/XiaoMi/pegasus"
                },
                {
                    "name": "pegasus",
                    "description": "VM based deployment for prototyping Big Data tools on Amazon Web Services",
                    "url": "https://github.com/InsightDataScience/pegasus"
                },
                {
                    "name": "pegasus",
                    "description": "Pegasus Workflow Management System",
                    "url": "https://github.com/pegasus-isi/pegasus"
                },
                {
                    "name": "Pegasus",
                    "description": "A PEG parser generator for .NET that integrates with MSBuild and Visual Studio.",
                    "url": "http://otac0n.com/Pegasus/"
                }
            ]
        },
        "Bower": {
            "result": [
                {
                    "name": "pegasus",
                    "description": "Load data while still loading other scripts, works with jQuery, Backbone, Angular...",
                    "url": "https://github.com/typicode/pegasus",
                    "keywords": [
                        "ajax",
                        "promise",
                        "xhr",
                        "http",
                        "request",
                        "XMLHttpRequest",
                        "data",
                        "json",
                        "bootstrap",
                        "performance",
                        "optimization",
                        "load",
                        "loader",
                        "preload",
                        "preloader"
                    ]
                }
            ]
        },
        "JSter": {
            "result": []
        },
        "MicroJS": {
            "result": [
                {
                    "name": "Pegasus",
                    "description": "Load JSON data while still loading other scripts (xhr + promise).",
                    "url": "https://github.com/typicode/pegasus",
                    "keywords": [
                        "AJAX",
                        "JSON",
                        "GET",
                        "xhr",
                        "request",
                        "promise",
                        "parallel",
                        "performance",
                        "load",
                        "preload"
                    ]
                }
            ]
        }
    }
}
```

## API

In your program you can use API provided by seeq in the following way:

```javascript
var seeq = require("seeq");
...
function onProgress(data) {
    console.log([data.number, "/", data.total, ": checked ", data.name, " at ", data.resource, 
                    ", results - ", data.result.result.length].join(""));
}

seeq.search(["chronoman", "knockout", "joy"], 
            callback, 
            {
                resource: ["NPM", "Github", "web components"], 
                settings: {
                    _general: {
                        limit: 5,
                        partialMatch: 2,
                        caseSensitive: true
                    },
                    github: {
                        limit: 10,
                        language: "js"
                    }
                },
                progressCallback: onProgress
            });
...
seeq.searchName("duratiform",
                callback,
                {resource: ["Bower", "MicroJS"]});
...
seeq.searchName("cheerio",
                callback,
                {
                    search: true,
                    resourceTag: ["library", "-cdn"]
                });
...
seeq.search(["adam", "eva"], 
            function(resultMap) {
                console.log( seeq.format.format(resultMap, 
                                                "json", 
                                                {queryList: ["eva", "adam"], verbose: true}) );
            });
```

See JSDoc-generated documentation in `doc` folder.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014-2018 Denis Sikuler  
Licensed under the MIT license.

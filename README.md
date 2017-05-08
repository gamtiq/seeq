# seeq

Detect whether a name is registered or present on some resource ([GitHub](https://github.com), [NPM](https://npmjs.org),
[Component](https://github.com/component/component), [Bower](http://bower.io), ...).

Also allows searching for string on specified resources.

[![NPM version](https://badge.fury.io/js/seeq.png)](http://badge.fury.io/js/seeq)
[![Build Status](https://travis-ci.org/gamtiq/seeq.png)](https://travis-ci.org/gamtiq/seeq)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Available resources

The following resources are available:

* [GitHub](https://github.com)
* [NPM](https://npmjs.org)
* [Component](https://github.com/component/component)
* [Bower](http://bower.io)
* [Registry of Grunt plugins](http://gruntjs.com/plugins)
* [Registry of Gulp plugins](http://gulpjs.com/plugins)
* [JSter](http://jster.net)
* [MicroJS](http://microjs.com)
* [CDNJS](http://cdnjs.com)
* [jsDelivr](http://www.jsdelivr.com)
* [Custom Elements](http://customelements.io)

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
   -f, --format           Result format; can be: text, json, markdown, raw  [text]
   -V, --verbose          Enable verbose output
   -v, --version          Show program version
   --github-lang          Search GitHub repositories that are written in the specified language
   --github-limit         Limit of quantity of GitHub results; default and maximum value is 100
   --github-user          GitHub username that should be used for authentication
   --github-password      GitHub account password
   --github-token         GitHub OAuth2 token that should be used for authentication instead of username and password


Available resources (13):

    * GitHub (https://github.com) - GitHub repositories
    * NPM (https://npmjs.org) - Node packaged modules registry
    * Component (https://github.com/component/component) - Component client package manager registry
    * Bower (http://bower.io) - Bower package manager registry
    * Grunt (http://gruntjs.com/plugins) - Registry of Grunt plugins
    * Gulp (http://gulpjs.com/plugins/) - Registry of Gulp plugins
    * JSter (http://jster.net) - Catalog of JavaScript libraries and tools for web development
    * MicroJS (http://microjs.com) - List of micro-frameworks and micro-libraries
    * CDNJS (http://cdnjs.com) - Content Distribution Network for popular web development frameworks, libraries, CSS and other web assets
    * jsDelivr (http://www.jsdelivr.com) - Content Delivery Network where any web developer can host their files, including CSS, fonts, JavaScript, jQuery plugins, etc.
    * Custom Elements (http://customelements.io) - A Web Components gallery for modern web apps
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
Checking GitHub, NPM, Component, Bower...
Progress: 18/18 (100%)

Results:

1. numgen

    GitHub - 4
        numgen - Creates objects that generate number sequences
        url: https://github.com/gamtiq/numgen

        numgen - doerp
        url: https://github.com/drmarduk/numgen

        numgen
        url: https://github.com/grancier/numgen

        NumGen - A number generating mobile app to use for awarding prizes at user groups
        url: https://github.com/scryan7371/NumGen

    NPM - 1
        numgen - Creates objects that generate number sequences
        url: https://github.com/gamtiq/numgen
        keywords: number sequence generator

    Component - 1
        numgen - Creates objects that generate number sequences
        url: https://github.com/gamtiq/numgen
        keywords: number sequence generator

    Bower - 1
        numgen - Creates objects that generate number sequences
        url: https://github.com/gamtiq/numgen
        keywords: number sequence generator

2. three

    GitHub - 5
        three - An easy-to-use Python wrapper for the Open311 API.
        url: three.codeforamerica.org

        three
        url: https://github.com/liaoxiaojia/three

        three - f
        url: https://github.com/bjliliang4/three

        three
        url: https://github.com/kaouadi/three

        three - phot
        url: https://github.com/rajivkumar/three

    NPM - 1
        three - JavaScript 3D library
        url: http://threejs.org/
        keywords: 3D WebGL Three ThreeJS CSS engine rendering geometry math

    Component - 1
        three - Three.js component
        url: https://github.com/cvdlab/three
        keywords: webgl three.js 3d

    Bower
        three is not found.

3. some-strange-name

    GitHub
        some-strange-name is not found.

    NPM
        some-strange-name is not found.

    Component
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

    GitHub - 3
        mixing - Functions to mix objects
        url: https://github.com/gamtiq/mixing
        repository: https://github.com/gamtiq/mixing.git
        language: JavaScript
        stars: 2

        mixingpanel
        url: https://github.com/gguerrero/mixingpanel
        repository: https://github.com/gguerrero/mixingpanel.git
        language: JavaScript
        stars: 1

        mixingloom-profiler-example - an example of profiling by mixingloom-profiler
        url: https://github.com/wighawag/mixingloom-profiler-example
        repository: https://github.com/wighawag/mixingloom-profiler-example.git
        language: JavaScript
        stars: 2

    Bower - 1
        mixing - Functions to mix objects
        url: https://github.com/gamtiq/mixing
        keywords: mixin mix merge object filter
        version: 0.0.3
        repository: git://github.com/gamtiq/mixing.git
        license: MIT

2. flight

    GitHub - 5
        flight - A component-based, event-driven JavaScript framework from Twitter
        url: http://flightjs.github.io/
        repository: https://github.com/flightjs/flight.git
        language: JavaScript
        stars: 5131

        flightplan - Node.js library for streamlining application deployment or systems administration tasks.
        url: https://npmjs.org/package/flightplan
        repository: https://github.com/pstadler/flightplan.git
        language: JavaScript
        stars: 346

        flight-stream - Real Time Flight Updates w/ Node.js, Redis and WebSockets
        url: https://github.com/waratuman/flight-stream
        repository: https://github.com/waratuman/flight-stream.git
        language: JavaScript
        stars: 32

        flight627 - prototype work towards cloud-based developer tooling
        url: https://github.com/spring-projects/flight627
        repository: https://github.com/spring-projects/flight627.git
        language: JavaScript
        stars: 29

        flight - flight-framework is a jsfl script framework with a CommonJS-like module mechanism.
        url: https://github.com/uzzu/flight
        repository: https://github.com/uzzu/flight.git
        language: JavaScript
        stars: 3

    Bower - 3
        flight - Clientside component infrastructure
        url: http://github.com/flightjs/flight
        version: 1.1.3
        repository: git://github.com/flightjs/flight.git

        flight-jasmine - Extensions to the Jasmine test framework for use with Flight
        url: http://github.com/twitter/flight-jasmine
        keywords: flight jasmine test
        version: 2.2.0
        repository: git://github.com/twitter/flight-jasmine.git

        flight-mocha - Extensions to the Mocha test framework for use with Flight
        url: http://github.com/naoina/flight-mocha
        keywords: flight mocha test
        version: 0.1.0
        repository: git://github.com/naoina/flight-mocha.git
```

Search for `unicorn` at resources that have tag `library` and do not have tags `node` and `cdn`,
limit results per resource up to 5, print the search result in JSON format.

```
> sees unicorn -m 5 --tag library,-node,-cdn --all-tag -f json
Checking GitHub, Bower, JSter, MicroJS...
Progress: 4/4 (100%)

Results:

{
    "unicorn": {
        "GitHub": {
            "result": [
                {
                    "name": "unicorn",
                    "description": "Unofficial Unicorn Mirror.",
                    "url": "http://unicorn.bogomips.org/"
                },
                {
                    "name": "capistrano-unicorn",
                    "description": "Capistrano integration for Unicorn!",
                    "url": "https://github.com/sosedoff/capistrano-unicorn"
                },
                {
                    "name": "gunicorn",
                    "description": "gunicorn 'Green Unicorn' is a WSGI HTTP Server for UNIX, fast clients and sleepy applications.",
                    "url": "http://www.gunicorn.org"
                },
                {
                    "name": "unicorn-worker-killer",
                    "description": "Automatically restart Unicorn workers based on 1) max number of requests and 2) max memory",
                    "url": "https://rubygems.org/gems/unicorn-worker-killer"
                },
                {
                    "name": "unicorn",
                    "description": "Development repository for Opscode Cookbook unicorn",
                    "url": "http://community.opscode.com/cookbooks/unicorn"
                }
            ]
        },
        "Bower": {
            "result": [
                {
                    "name": "angular-unicorn-directive",
                    "url": "http://github.com/btford/angular-unicorn-directive"
                }
            ]
        },
        "JSter": {
            "result": []
        },
        "MicroJS": {
            "result": []
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
                resource: ["NPM", "Component", "Github"], 
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
Copyright (c) 2014-2017 Denis Sikuler  
Licensed under the MIT license.

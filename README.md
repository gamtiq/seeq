# seeq

Detect whether a name is registered or present on some resource ([GitHub](https://github.com), [NPM](https://npmjs.org),
[Component](https://github.com/component/component), [Bower](http://bower.io), [Jam](http://jamjs.org), ...).

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
* [Jam](http://jamjs.org)
* [Registry of Grunt plugins](http://gruntjs.com/plugins)

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
   -r, --at               Comma-separated list of names (case-insensitive) of resources that should be checked/searched; all resources by default
   -l, --list-resource    Show information about all available resources
   -p, --partial-match    Allow partial matching when checking name: 0 - disallow (by default), 1 - allow at the beginning of matching strings, 2 - allow substring matching
   -c, --case-sensitive   Use case-sensitive check/search when possible
   -s, --search           Make search instead of check
   --limit                Limit of quantity of results per resource
   -V, --verbose          Enable verbose output
   -v, --version          Show program version
   --github-lang          Search GitHub repositories that are written in the specified language
   --github-limit         Limit of quantity of GitHub results; default and maximum value is 100
   --github-user          GitHub username that should be used for authentication
   --github-password      GitHub account password
   --github-token         GitHub OAuth2 token that should be used for authentication instead of username and password


Available resources:

    * GitHub (https://github.com) - GitHub repositories
    * NPM (https://npmjs.org) - Node packaged modules registry
    * Component (https://github.com/component/component) - Component client package manager registry
    * Bower (http://bower.io) - Bower package manager registry
    * Jam (http://jamjs.org) - Jam package manager repository
    * Grunt (http://gruntjs.com/plugins) - Registry of Grunt plugins
```

### Examples

Check `numgen`, `three` and `some-strange-name` at all resources and limit results per resource up to 10.

```
> seeq numgen three some-strange-name --limit 10
Checking GitHub, NPM, Component, Bower, Jam, Grunt...
Progress: 18/18 (100%)

Results:

1. numgen

    GitHub - 3
        numgen
        url: https://github.com/grancier/numgen

        numgen - Creates objects that generate number sequences
        url: https://github.com/gamtiq/numgen

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

    Jam - 1
        numgen - Creates objects that generate number sequences
        url: https://github.com/gamtiq/numgen
        keywords: number sequence generator

    Grunt
        numgen is not found.

2. three

    GitHub - 10
        three - An easy-to-use Python wrapper for the Open311 API.
        url: three.codeforamerica.org

        three
        url: https://github.com/f22jay/three

        three
        url: https://github.com/liaoxiaojia/three

        three - f
        url: https://github.com/bjliliang4/three

        three
        url: https://github.com/kaouadi/three

        three - phot
        url: https://github.com/rajivkumar/three

        three - Experiments with Three.js and WebGL.
        url: https://github.com/superhighfives/three

        Three
        url: https://github.com/sreedhe/Three

        three
        url: https://github.com/gcortesp/three

        three - third
        url: https://github.com/jiidaozhongguo/three

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

    Jam - 1
        three - JavaScript 3D library
        url: http://threejs.org

    Grunt
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

    Jam
        some-strange-name is not found.

    Grunt
        some-strange-name is not found.
```

Check `mixing` and `flight` at GitHub and Bower, allow partial matching at the beginning, use case-sensitive search,
limit Bower results up to 3 and GitHub results up to 5, include only GitHub projects that are written in JavaScript,
show additional information about found items.

```
> seeq mixing flight -r github,bower --partial-match 1 -c --bower-limit 3 --github-limit 5 --github-lang js --verbose
Checking github, bower...
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
        keywords: mixin mix merge object
        version: 0.0.2
        repository: git://github.com/gamtiq/mixing.git
        license: MIT

2. flight

    GitHub - 5
        flight - A component-based, event-driven JavaScript framework from Twitter
        url: http://flightjs.github.io/
        repository: https://github.com/flightjs/flight.git
        language: JavaScript
        stars: 4927

        flight-stream - Real Time Flight Updates w/ Node.js, Redis and WebSockets
        url: https://github.com/waratuman/flight-stream
        repository: https://github.com/waratuman/flight-stream.git
        language: JavaScript
        stars: 32

        flightplan - Node.js library for streamlining application deployment or systems administration tasks.
        url: https://npmjs.org/package/flightplan
        repository: https://github.com/pstadler/flightplan.git
        language: JavaScript
        stars: 174

        flight - flight-framework is a jsfl script framework with a CommonJS-like module mechanism.
        url: https://github.com/uzzu/flight
        repository: https://github.com/uzzu/flight.git
        language: JavaScript
        stars: 3

        flight
        url: https://github.com/mrlong/flight
        repository: https://github.com/mrlong/flight.git
        language: JavaScript

    Bower - 3
        flight - Clientside component infrastructure
        url: http://github.com/flightjs/flight
        version: 1.1.2
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

Search for `unicorn` at all resources and limit results per resource up to 5.

```
> seeq unicorn -s --limit 5
Checking GitHub, NPM, Component, Bower, Jam, Grunt...
Progress: 6/6 (100%)

Results:

1. unicorn

    GitHub - 5
        unicorn - Unofficial Unicorn Mirror.
        url: http://unicorn.bogomips.org/

        capistrano-unicorn - Capistrano integration for Unicorn!
        url: https://github.com/sosedoff/capistrano-unicorn

        unicorn - Development repository for Opscode Cookbook unicorn
        url: http://community.opscode.com/cookbooks/unicorn

        lolcat - Rainbows and unicorns!
        url: https://github.com/busyloop/lolcat

        unicorn-worker-killer - Automatically restart Unicorn workers based on 1) max number of requests and 2) max memory
        url: https://rubygems.org/gems/unicorn-worker-killer

    NPM - 5
        alibaba-dev - alibaba developer
        url: https://npmjs.org/package/alibaba-dev
        keywords: tianma unicorn alibaba developer autosave

        ascii-art-reverse - reverses ascii art. caution, uses magic.
        url: https://npmjs.org/package/ascii-art-reverse
        keywords: magic unicorn ascii art

        cornify - A super magical unicorn module
        url: https://npmjs.org/package/cornify
        keywords: cornify

        fugue - Unicorn for node
        url: https://npmjs.org/package/fugue

        grunt-unicorn - Always use grunt, unless you can use grunt-unicorn. Then always use grunt-unicorn.
        url: https://npmjs.org/package/grunt-unicorn
        keywords: gruntplugin

    Component
        unicorn is not found.

    Bower - 1
        angular-unicorn-directive
        url: git://github.com/btford/angular-unicorn-directive.git

    Jam
        unicorn is not found.

    Grunt - 1
        unicorn - Always use grunt&comma; unless you can use grunt-unicorn&period; Then always use grunt-unicorn&period;
        url: https://npmjs.org/package/grunt-unicorn
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
                {resource: ["Bower", "Jam"]});
...
seeq.searchName("cheerio",
                callback,
                {
                    search: true
                });
```

See JSDoc-generated documentation in `doc` folder.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 Denis Sikuler  
Licensed under the MIT license.

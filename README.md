# seeq

Detect whether a name is registered or present on some resource ([GitHub](https://github.com), [NPM](https://npmjs.org),
[Component](https://github.com/component/component), [Bower](http://bower.io), [Jam](http://jamjs.org), ...).

[![NPM version](https://badge.fury.io/js/seeq.png)](http://badge.fury.io/js/seeq)
[![Build Status](https://travis-ci.org/gamtiq/seeq.png)](https://travis-ci.org/gamtiq/seeq)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Installation

To install and use seeq [Node.js](http://nodejs.org) should be installed in your system.
Run the following command to install seeq:

    npm install -g seeq

## Usage

Run `seeq` to show usage information.

```
> seeq

Usage: seeq [name]... [options]

name     Name that should be checked for presence on a resource

Options:
   -h, --help            Show usage information and exit
   -r, --at              Comma-separated list of names (case-insensitive) of resources that should be checked; all resources by default
   -l, --list-resource   Show information about all available resources
   -V, --verbose         Enable verbose output
   -v, --version         Show program version
   --github-lang         Search GitHub repositories that are written in the specified language
   --github-limit        Limit of quantity of GitHub results; default and maximum value is 100
   --github-user         GitHub username that should be used for authentication
   --github-password     GitHub account password
   --github-token        GitHub OAuth2 token that should be used for authentication instead of username and password


Available resources:

    GitHub - GitHub repositories
    url: https://github.com
    tags: repository project library framework package
    For requests using Basic Authentication or OAuth token, you can make up to 20 requests per minute. For unauthenticated requests, the rate limit allows you to make up to 5 requests per minute.

    NPM - Node packaged modules registry
    url: https://npmjs.org
    tags: js javascript package library node

    Component - Component client package manager registry
    url: https://github.com/component/component
    tags: js javascript package component browser

    Bower - Bower package manager registry
    url: http://bower.io
    tags: js javascript package component library browser

    Jam - Jam package manager repository
    url: http://jamjs.org
    tags: js javascript package requirejs amd browser
```

### Examples

Check `numgen`, `three` and `some-strange-name` at all resources and limit GitHub results up to 10.

```
> seeq numgen three some-strange-name --github-limit 10
Checking GitHub, NPM, Component, Bower, Jam...
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
```

Check `mixing` and `flight` at GitHub and Bower, include only GitHub projects that are written in JavaScript,
show additional information about found items.

```
> seeq mixing flight -r github,bower --github-lang js --verbose
Checking github, bower...
Results:

1. mixing
    GitHub - 1
        mixing - Functions to mix objects
        url: https://github.com/gamtiq/mixing
        repository: https://github.com/gamtiq/mixing.git
        language: JavaScript
        stars: 2
    Bower - 1
        mixing - Functions to mix objects
        url: https://github.com/gamtiq/mixing
        keywords: mixin mix merge object
        version: 0.0.2
        license: MIT

2. flight
    GitHub - 10
        flight - A component-based, event-driven JavaScript framework from Twitter
        url: http://flightjs.github.io/
        repository: https://github.com/flightjs/flight.git
        language: JavaScript
        stars: 4866

        Flight - Unit testing for Pokemon Online
        url: https://github.com/TheUnknownOne/Flight
        repository: https://github.com/TheUnknownOne/Flight.git
        language: JavaScript

        flight - flight-framework is a jsfl script framework with a CommonJS-like module mechanism.
        url: https://github.com/uzzu/flight
        repository: https://github.com/uzzu/flight.git
        language: JavaScript
        stars: 3

        flight
        url: https://github.com/mrlong/flight
        repository: https://github.com/mrlong/flight.git
        language: JavaScript

        flight
        url: https://github.com/inage-toru/flight
        repository: https://github.com/inage-toru/flight.git
        language: JavaScript

        flight - Flat file database in node.js
        url: https://github.com/aishwar/flight
        repository: https://github.com/aishwar/flight.git
        language: JavaScript

        Flight
        url: https://github.com/niuniu98/Flight
        repository: https://github.com/niuniu98/Flight.git
        language: JavaScript

        flight
        url: https://github.com/webjars/flight
        repository: https://github.com/webjars/flight.git
        language: JavaScript

        flight - Display CSN flight info @T2.BCIA
        url: https://github.com/yuanl/flight
        repository: https://github.com/yuanl/flight.git
        language: JavaScript

        Flight - Different modes of flight
        url: https://github.com/DevenSmith/Flight
        repository: https://github.com/DevenSmith/Flight.git
        language: JavaScript
    Bower - 1
        flight - Clientside component infrastructure
        version: 1.1.2
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

seeq.check(["chronoman", "knockout", "joy"], 
            callback, 
            {
                resource: ["NPM", "Component", "Github"], 
                settings: {
                    github: {
                        limit: 10,
                        language: "js"
                    }
                },
                progressCallback: onProgress
            });
...
seeq.checkName("duratiform",
                callback,
                {resource: ["Bower", "Jam"]});
```

See JSDoc-generated documentation in `doc` folder.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 Denis Sikuler  
Licensed under the MIT license.

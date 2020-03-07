### 1.0.4 / 2020-03-08

* Fix problem with incorrect output of license
* Update dependencies

### 1.0.3 / 2020-02-25

* Fix grunt resource module implementation to accommodate to new data format of plugin's list

### 1.0.2 / 2018-09-09

* Fix URL of Bower registry

### 1.0.1 / 2017-10-31

* Fix gulp resource module implementation

### 1.0.0 / 2017-10-29

* Remove support for outdated resources (Component, Jam, jsDelivr, SPM)
* Replace Custom Elements by Web components
* Update implementation of resource modules

### 0.2.2 / 2014-08-24

* Add resources for [SPM](http://spmjs.io) and [Custom Elements](http://customelements.io)

### 0.2.1 / 2014-07-15

* Add resource for registry of [Gulp plugins](http://gulpjs.com/plugins)
* Add formatter to convert result into Markdown

### 0.2.0 / 2014-05-18

* Add ability to format search result
* `cli.js` refactoring
* Normalize data from different resources
* Add `sees` command
* Fix errors in modules for Grunt and MicroJS

### 0.1.5 / 2014-03-30

* Add resource for [JSter](http://jster.net)
* Add ability to select resources not having a tag

### 0.1.4 / 2014-03-18

* Add resources for [CDNJS](http://cdnjs.com) and [jsDelivr](http://www.jsdelivr.com)
* Decode HTML entities in description of Grunt plugin

### 0.1.3 / 2014-03-08

* Add possibility to filter resources by tag
* Add `filterList` method in `resource` module
* Add `-m` shortcut for `--limit` option

### 0.1.2 / 2014-03-01

* Add resource for [MicroJS](http://microjs.com)
* Add the following methods in `resource` module: `initList`, `setList`

### 0.1.1 / 2014-02-26

* Add support for `search` setting for `seeq.searchName`
* Change format of list of resources that is displayed in usage message
* Update dependencies: `npm` to 1.4.4, `request` to 2.34.0

### 0.1.0 / 2014-02-21

* Add ability to make search for given string (`--search` option)

### 0.0.3 / 2014-02-15

* Add resource for registry of Grunt plugins
* Add the following methods in `resource` module: `remove`, `removeAll`, `resetList`

### 0.0.2 / 2014-02-11

* Add support for partial matching, case-sensitive search and results limit
* Add setting for progress callback


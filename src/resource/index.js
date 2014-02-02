/**
 * @module resource
 */


"use strict";

var resourceList = [],
    resourceMap = {};


function getResourceName(resource) {
    return resource.name;
}


/**
 * Check whether there is a resource with given name.
 * 
 * @param {String} name
 *      A name that should be checked (case-insensitive).
 * @return {Boolean}
 *      <code>true</code> if there is a resource with the given name,
 *      <code>false</code> if no one of available resources has the specified name.
 * @alias module:resource.isAvailable
 */
function isAvailable(name) {
    return name.toLowerCase() in resourceMap;
}

/**
 * Return identifier of resource with given name.
 * 
 * @param {String} name
 *      A resource name (case-insensitive).
 * @return {String | null}
 *      Identifier of resource that has the given name
 *      or <code>null</code> if no one of available resources has the specified name.
 * @alias module:resource.getIdByName
 */
function getIdByName(name) {
    /*jshint laxbreak:true*/
    var sId = name.toLowerCase();
    return sId in resourceMap
            ? sId
            : null;
}

/**
 * Return list that contains names of all available resources.
 * 
 * @return {Array}
 *      List that contains names of all available resources.
 * @alias module:resource.getAllNameList
 */
function getAllNameList() {
    return resourceList.map(getResourceName);
}


/**
 * Return list of specified resources.
 * If no selection criteria is set then returns list of all available resources.
 * 
 * @param {Object} [settings]
 *      Specifies which data items should be returned.
 *      The following settings are supported (name - type - description):
        <ul>
        <li><code>includeApi</code> - <code>Boolean</code> - whether API object for resource should be included into data item
                under <code>api</code> field; <code>false</code> by default
        <li><code>selectResource</code> - <code>Array | String</code> - list of names of resources or name of resource (case-insensitive)
                that should be included into result; if setting's value is not specified, all resources will be included into result
        </ul>
 * @return {Array}
 *      List that contains objects presenting data about selected resources.
 * @alias module:resource.getList
 */
function getList(settings) {
    /*jshint boss:true*/
    var resList = resourceList,
        result = [],
        bIncludeApi, nI, nL, resource, selectedIds;
    // Prepare settings
    if (! settings) {
        settings = {};
    }
    if (selectedIds = settings.selectResource) {
        if (typeof selectedIds === "string") {
            selectedIds = [ selectedIds.toLowerCase() ];
        }
        else {
            selectedIds = selectedIds.map(function(name) {
                return name.toLowerCase();
            });
        }
    }
    bIncludeApi = settings.includeApi;
    // Form result list
    for (nI = 0, nL = resList.length; nI < nL; nI++) {
        resource = resList[nI];
        if (! selectedIds || selectedIds.indexOf(resource.id) > -1) {
            if (bIncludeApi && ! resource.api) {
                resource.api = require(resource.module);
            }
            result.push(resource);
        }
    }
    return result;
}

/**
 * Return object that represents specified resources.
 * If no selection criteria is set then returns object that contains data about all available resources.
 * 
 * @param {Object} [settings]
 *      Specifies which data items should be returned.
 *      See {@link module:resource.getList getList} for details.
 * @return {Object}
 *      Object that contains data about selected resources.
 *      Fields are resource keys, values are objects representing data about resources.
 * @alias module:resource.getMap
 * @see {@link module:resource.getList getList}
 */
function getMap(settings) {
    var result = {};
    getList(settings).forEach(function(item) {
        result[item.id] = item;
    });
    return result;
}

/**
 * Add data about a resource into the list of available resources.
 * 
 * @param {Object} resource
 *      Represents data about a resource that should be added.
 *      Object should contain the following fields (name - type - description):
        <ul>
        <li><code>name</code> - <code>String</code> - resource name (required)
        <li><code>description</code> - <code>String</code> - resource description
        <li><code>url</code> - <code>String</code> - URL of resource's site
        <li><code>tag</code> - <code>Array of String</code> - tags/keywords of resource
        <li><code>note</code> - <code>String</code> - additional information about resource usage
        <li><code>module</code> - <code>String</code> - path to the module that should be used to work with resource;
                the module should implement necessary API 
        <li><code>api</code> - <code>Object</code> - object that implements necessary API to work with resource
        </ul>
        The only mandatory field is <code>name</code>. Also <code>module</code> or <code>api</code> field should be specified.
 * @return {Object}
 *      Object that represents module <code>exports</code>.
 * @throws Will throw an error if resource name is not specified.
 * @throws Will throw an error if resource API object and path to resource module are not specified.
 * @throws Will throw an error if there is a resource with the same name.
 * @alias module:resource.add
 * @see {@link module:resource.isAvailable isAvailable}
 */
function add(resource) {
    /*jshint newcap:false*/
    var sName = resource.name,
        sId;
    if (! sName) {
        throw Error("Unknown name: resource name is not specified");
    }
    if ((! resource.api || typeof resource.api !== "object") && (! resource.module || typeof resource.module !== "string")) {
        throw Error("Unknown API: resource API object or path to resource module must be specified");
    }
    if (isAvailable(sName)) {
        throw Error("Duplicate name: there is a resource with the same name");
    }
    
    sId = resource.id = sName.toLowerCase();
    if (! resource.tag) {
        resource.tag = [];
    }
    resourceList.push(resource);
    resourceMap[sId] = resource;
    return exports;
}

// Form list of all available resources
require("./list.json").forEach(add);


//Exports

exports.isAvailable = isAvailable;
exports.getIdByName = getIdByName;
exports.getAllNameList = getAllNameList;
exports.getList = getList;
exports.getMap = getMap;
exports.add = add;

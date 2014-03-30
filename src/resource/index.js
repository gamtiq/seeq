/**
 * API to work with resources.
 * 
 * @module resource
 */


"use strict";

var sourceList = [],
    resourceList = [],
    resourceMap = {};


function getResourceName(resource) {
    return resource.name;
}

function toLowerCase(value) {
    return value.toLowerCase();
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
 * Check resource on presence or absence of specified tags.
 * 
 * @param {Object} resource
 *      Represents data about a resource that should be checked.
 * @param {Array} tagList
 *      List of tags (in lower case) that should be checked on presence or absence in resource tags.
 *      Tag in form "name" (without quotes; a positive tag) means that resource should be checked on presence of "name" tag.
 *      Tag in form "-name" (without quotes; a negative tag) means that resource should be checked on absence of "name" tag.
 * @param {Boolean} [checkAllTags]
 *      Whether all tags specified in <code>tagList</code> should be checked on presence/absence in resource tags.
 *      When parameter has <code>true</code> value it means that resource should have all positive tags 
 *      and should not have any negative tag.
 *      When parameter has <code>false</code> value (by default) it means that resource should have one of positive tags 
 *      and should not have one of negative tags.
 * @return {Boolean}
 *      <code>true</code> if resource tags satisfy to specified tags (depending on <code>checkAllTags</code> value),
 *      <code>false</code> otherwise.
 * @alias module:resource.checkResourceTags
 */
function checkResourceTags(resource, tagList, checkAllTags) {
    /*jshint laxbreak:true*/
    var resTags = resource.tag,
        nL = tagList.length,
        nAbsent = 0,
        nAbsentMatch = 0,
        nPresent = 0,
        nPresentMatch = 0,
        nI, sTag;
    
    for (nI = 0; nI < nL; nI++) {
        sTag = tagList[nI];
        if (sTag.charAt(0) === "-") {
            nAbsent++;
            sTag = sTag.substring(1);
            if (resTags.indexOf(sTag) === -1) {
                nAbsentMatch++;
            }
        }
        else {
            nPresent++;
            if (resTags.indexOf(sTag) > -1) {
                nPresentMatch++;
            }
        }
        if (! checkAllTags && nPresentMatch && nAbsentMatch) {
            return true;
        }
    }
    return checkAllTags
            ? (nPresent === nPresentMatch && nAbsent === nAbsentMatch)
            : Boolean((! nPresent || nPresentMatch) && (! nAbsent || nAbsentMatch));
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

/**
 * Remove resource with given name from list of resources.
 * 
 * @param {String} name
 *      Name of resource that should be removed (case-insensitive).
 * @return {Object | null}
 *      Object that represents removed resource
 *      or <code>null</code> if no one of resources from list has the specified name.
 * @alias module:resource.remove
 */
function remove(name) {
    var sId = name.toLowerCase(),
        nI, nL, resource;
    if (sId in resourceMap) {
        for (nI = 0, nL = resourceList.length; nI < nL; nI++) {
            if ((resource = resourceList[nI]).id === sId) {
                resourceList.splice(nI, 1);
                delete resourceMap[sId];
                return resource;
            }
        }
    }
    return null;
}

/**
 * Clear list of resources.
 * 
 * @return {Object}
 *      Object that represents module <code>exports</code>.
 * @see {@link module:resource.add add}
 * @alias module:resource.removeAll
 */
function removeAll() {
    // Delete current resources
    resourceList.length = 0;
    resourceMap = {};
    return exports;
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
        <li><code>selectName</code> - <code>Array | String</code> - specifies filter for available resources by name;
                list of names of resources or name of resource (case-insensitive) that should be included into result
        <li><code>selectTag</code> - <code>Array | String</code> - specifies filter for available resources by tag;
                list of tags or tag (case-insensitive) that should be used to select resources into result;
                resources that satisfy to specified tags (depending on <code>checkAllTags</code> setting)
                will be included in result; see {@link module:resource.checkResourceTags checkResourceTags} for details
        <li><code>checkAllTags</code> - <code>Boolean</code> - whether all tags specified in <code>selectTag</code>
                 should be checked; see {@link module:resource.checkResourceTags checkResourceTags} for details
        </ul>
        Filter by name (<code>selectName</code>) and filter by tag (<code>selectTag</code>)
        can be used separately or together.
        If no filter is specified, all resources will be included into result.
 * @return {Array}
 *      List that contains objects presenting data about selected resources.
 * @alias module:resource.getList
 * @see {@link module:resource.checkResourceTags checkResourceTags}
 */
function getList(settings) {
    /*jshint boss:true, laxbreak:true*/
    var resList = resourceList,
        result = [],
        bCheckAllTags, bIncludeApi, nI, nL, resource, selectedIds, selectedTags;
    // Prepare settings
    if (! settings) {
        settings = {};
    }
    if (selectedIds = settings.selectName) {
        if (typeof selectedIds === "string") {
            selectedIds = [ selectedIds.toLowerCase() ];
        }
        else {
            selectedIds = selectedIds.map(toLowerCase);
        }
    }
    if (selectedTags = settings.selectTag) {
        if (typeof selectedTags === "string") {
            selectedTags = [ selectedTags.toLowerCase() ];
        }
        else {
            selectedTags = selectedTags.map(toLowerCase);
        }
    }
    bCheckAllTags = settings.checkAllTags;
    bIncludeApi = settings.includeApi;
    // Form result list
    for (nI = 0, nL = resList.length; nI < nL; nI++) {
        resource = resList[nI];
        if ((! selectedIds && ! selectedTags) 
                || (selectedIds && selectedIds.indexOf(resource.id) > -1)
                || (selectedTags && checkResourceTags(resource, selectedTags, bCheckAllTags))) {
            if (bIncludeApi && ! resource.api) {
                resource.api = require(resource.module);
            }
            result.push(resource);
        }
    }
    return result;
}

/**
 * Change list of available resources.
 * <br>
 * In essence this method [removes all]{@link module:resource.removeAll} available resources
 * and [adds]{@link module:resource.add} data about each given resource into the list of available resources.
 * 
 * @param {Array | Object} list
 *      List that contains objects presenting data about resources,
 *      or object with data about an resource.
 * @return {Object}
 *      Object that represents module <code>exports</code>.
 * @see {@link module:resource.add add}
 * @see {@link module:resource.removeAll removeAll}
 * @alias module:resource.setList
 */
function setList(list) {
    // Delete current resources
    removeAll();
    // Form list of available resources
    (Array.isArray(list) ? list : [list]).forEach(add);
    return exports;
}

/**
 * Apply filter on list of currently available resources.
 * <br>
 * After operation only resources conforming to filter will be available.
 * <br>
 * In essence, this method is a wrapper for the following code:
 * <br>
 * <code>setList( getList(settings) )</code>
 * 
 * @param {Object} [settings]
 *      Specifies which resources should be selected.
 *      The following settings can be used to select resources:
 *      <code>selectName, selectTag, checkAllTags</code>.
 *      See {@link module:resource.getList getList} for details.
 * @return {Object}
 *      Object that represents module <code>exports</code>.
 * @alias module:resource.filterList
 * @see {@link module:resource.getList getList}
 * @see {@link module:resource.resetList resetList}
 * @see {@link module:resource.setList setList}
 */
function filterList(settings) {
    return setList( getList(settings) );
}
/**
 * Return list that contains names of all available resources.
 * 
 * @return {Array}
 *      List that contains names of all available resources.
 * @alias module:resource.getAllNameList
 * @see {@link module:resource.getNameList getNameList}
 */
function getAllNameList() {
    return resourceList.map(getResourceName);
}

/**
 * Return list that contains names of selected resources.
 * <br>
 * If no selection criteria is set then returns list of names of all available resources.
 * 
 * @param {Object} [settings]
 *      Specifies selection criteria. The following settings can be used to select resources:
 *      <code>selectName, selectTag, checkAllTags</code>.
 *      See {@link module:resource.getList getList} for details.
 * @return {Array}
 *      List that contains names of selected resources.
 * @alias module:resource.getNameList
 * @see {@link module:resource.getAllNameList getAllNameList}
 * @see {@link module:resource.getList getList}
 */
function getNameList(settings) {
    return getList(settings).map(getResourceName);
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
 * Set list of resources to initial state containing data about all available resources.
 * 
 * @return {Object}
 *      Object that represents module <code>exports</code>.
 * @see {@link module:resource.setList setList}
 * @alias module:resource.resetList
 */
function resetList() {
    return setList(sourceList);
}

/**
 * Set initial list of all available resources.
 * <br>
 * This list is used to [reset]{@link module:resource.resetList} to initial state.
 * 
 * @param {Array | Object} list
 *      List that contains objects presenting data about resources,
 *      or object with data about an resource.
 * @return {Object}
 *      Object that represents module <code>exports</code>.
 * @see {@link module:resource.resetList resetList}
 * @see {@link module:resource.setList setList}
 * @alias module:resource.initList
 */
function initList(list) {
    sourceList = Array.isArray(list) ? list : [list];
    return resetList();
}


// Initialize list of resources
initList(require("./list.json"));

//Exports

exports.isAvailable = isAvailable;
exports.getIdByName = getIdByName;
exports.getAllNameList = getAllNameList;
exports.getNameList = getNameList;
exports.checkResourceTags = checkResourceTags;
exports.getList = getList;
exports.setList = setList;
exports.filterList = filterList;
exports.getMap = getMap;
exports.add = add;
exports.remove = remove;
exports.removeAll = removeAll;
exports.resetList = resetList;
exports.initList = initList;

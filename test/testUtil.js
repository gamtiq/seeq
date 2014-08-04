// Helpful methods for tests

var expect = require("./lib/chai").expect,
    nock = require("nock");

/*
 * Return value of `name` field of given object.
 * 
 * @param {Object} entity
 *      Object whose field value should be returned.
 * @return {Any}
 *      Value of `name` field of given object.
 */
function getName(entity) {
    return entity.name;
}

/*
 * Return callback function that can be used to test result of calling `detect` method.
 * 
 * @param {Any} expErr
 *      Expected error.
 * @param {Any} expResult
 *      Expected result.
 * @return {Function}
 *      Function that can be used as callback to test result of `detect` method.
 */
function getDetectCallback(expErr, expResult) {
    return function(err, result) {
        if (err instanceof Error) {
            expect(err.message)
                .equal(expErr.message);
            expect(err.constructor)
                .equal(expErr.constructor);
        }
        else {
            expect(err)
                .eql(expErr);
        }
        expect(result.map(getName))
            .eql(expResult.map(getName));
    };
}

/*
 * Return part from given list which contains only objects with specified names (namely values of `name` field).
 * 
 * @param {Array} list
 *      List of objects which should be filtered.
 * @param {Array, String} names
 *      List of names (or only a name). If value of `name` field of an object is in the specified list 
 *      then the object will be included into result.
 * @return {Array}
 *      List of objects for which value of `name` field is in the specified list.
 */
function filterObjectListByNames(list, names) {
    if (typeof names === "string") {
        names = [names];
    }
    return list.filter(function(entity) {
        return names.indexOf(entity.name) > -1;
    });
}

/*
 * Mock success request for specified URL.
 * 
 * @param {String} host
 *      Specifies address of server for which request should be mocked in the following form:
 *      protocol://domain[:port]
 *      where port is optional.
 * @param {String} path
 *      Part of URL after domain/port (starting form /). May contain query string.
 * @param {Object, String} responseData
 *      Data which should be used as response for mocked request.
 */
function mockSuccessRequest(host, path, responseData) {
    nock(host)
        .get(path)
        .reply(200, responseData);
}

/*
 * Mock failed request for specified URL.
 * 
 * @param {String} host
 *      Specifies address of server for which request should be mocked in the following form:
 *      protocol://domain[:port]
 *      where port is optional.
 * @param {String} path
 *      Part of URL after domain/port (starting form /). May contain query string.
 * @param {Number} responseCode
 *      Response code.
 */
function mockFailRequest(host, path, responseCode) {
    nock.cleanAll();
    nock(host)
        .get(path)
        .reply(responseCode);
}

/*
 * Call specified `detect` function.
 * 
 * @param {Function | null} prepare
 *      Function that should be called before `detect` function.
 * @param {Function} detect
 *      Function that should be called.
 * @param {String} name
 *      Name to check or string to search for.
 * @param {Function} callback
 *      Function that should be called to process operation's result.
 * @param {Object} [settings]
 *      Operation settings.
 */
function callDetect(prepare, detect, name, callback, settings) {
    /*jshint expr:true*/
    prepare &&
        prepare();
    detect(name, callback, settings);
}

// Exports
exports.getName = getName;
exports.getDetectCallback = getDetectCallback;
exports.filterObjectListByNames = filterObjectListByNames;
exports.mockSuccessRequest = mockSuccessRequest;
exports.mockFailRequest = mockFailRequest;
exports.callDetect = callDetect;


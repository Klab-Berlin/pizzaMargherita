var DEFAULT_LIST_SEPARATOR = ',';
var DEFAULT_FIELD_SEPARATOR = ';';
var DEFAULT_MEMBER_SEPARATOR = '.';

var csv_to_json_support = require('./CsvToJsonConverter');

/**
 * Converter from JSON to CSV supporting:
 *  - fields having nested objects
 *  - fields having array of simple types
 *  - fields having array of objects --> data replaced with Array({size_of_the_array})
 *
 * @param options
 * @param options.fieldSeparator
 * @param options.listSeparator
 * @param options.memberSeparator
 * @constructor
 */
var JsonToCsvConverter = function (options) {
    options = options || {};

    this.fieldSeparator = options.fieldSeparator || DEFAULT_FIELD_SEPARATOR;
    this.listSeparator = options.listSeparator || DEFAULT_LIST_SEPARATOR;
    this.memberSeparator = options.memberSeparator || DEFAULT_MEMBER_SEPARATOR;
};

/**
 * @param objArr array of Javascript objects to be converted
 */
JsonToCsvConverter.prototype.convert = function (objArr) {
    var self = this;

    // flattening all the objects
    var rowsFlatValues = objArr.map(function (o) {
        return self.flatten(o);
    });

    // collecting the keys among all the entries
    var keys = Object.keys(rowsFlatValues.reduce(
            function (previousValue, currentValue) {
                Object.keys(currentValue).forEach(
                    function (key) {
                        previousValue[key] = null;
                    });
                return previousValue;
            }, {})
    );

    keys.sort();

    // building the output
    var rowsOutput = rowsFlatValues.map(
        function (flatRow) {
            return keys.map(
                function (key) {
                    return flatRow[key];
                }).join(self.fieldSeparator);
        }
    );

    return [keys.join(self.fieldSeparator)].concat(rowsOutput).join("\n");
};

/**
 * Flatten an object
 * @param obj js object to flatten
 * @param keyRoot for private (recursive) use only
 * @param valuesMap for private (recursive) use only
 * @returns {*|{}} array of strings:
 *  - the first string contains the fields (column names)
 *  - the following entries contain the data
 */
JsonToCsvConverter.prototype.flatten = function (obj, keyRoot, valuesMap) {
    var self = this;

    keyRoot = keyRoot || "";
    valuesMap = valuesMap || {};

    Object.keys(obj).forEach(function (key) {
        var val = obj[key];

        if (isArray(val)) {
            if (val.some(isObject)) {   // array of objects
                valuesMap[keyRoot + key] = "Array(" + val.length + ")";
            } else {    // array of simple values
                valuesMap[keyRoot + key] = val.join(self.listSeparator);
            }
        } else if (isObject(val)) { // nested object
            if (val == null) {
                valuesMap[keyRoot + key] = "null";
            } else {
                self.flatten(val, keyRoot + key + self.memberSeparator, valuesMap);
            }
        } else {    // simple value
            valuesMap[keyRoot + key] = val.toString();
        }

    });

    return valuesMap;
};


// helper function
function isObject(val) {
    return typeof(val) === 'object';
}

// helper function
function isArray(val) {
    return Array.isArray(val);
}

csv_to_json_support(JsonToCsvConverter);
module.exports = JsonToCsvConverter;

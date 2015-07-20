var csv_to_json_converter = require('../converters/CsvToJsonConverter');
var json_to_csv_converter = require('../converters/JsonToCsvConverter');
var readFile = require('./readFile');

module.exports = function( config ) {
	config = config || {};
	var c2j = new csv_to_json_converter(config);
	var j2c = new json_to_csv_converter(config);

	return {
		csvToJson: c2j.convert.bind(c2j),
		jsonToCsv: j2c.convert.bind(j2c),
		csvToJsonFromFile: function( file, callback ) {
			readFile(
				file,
				c2j.convert.bind(c2j),
				callback || function(){}
			);
		}
	};
};
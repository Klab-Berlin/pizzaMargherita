var expect = require('chai').expect;
var pizzaMargherita = require('../libs/index.js');

var file = '/var/www/kopauser/tests/assets/data.csv';
var comma_config = {
	field_seperator: ','
};
var converter = pizzaMargherita(comma_config);

describe( 'pizzaMargherita', function() {
	it( 'should read the file', function( done ) {
		converter.csvToJsonFromFile(
			file,
			function(error, result) {
				done();
			}
		)
	});

	it( 'should have three entries', function( done ) {
		converter.csvToJsonFromFile(
			file,
			function(error, result) {
				expect(result.length).to.eq(3);
				done();
			}
		);
	});
});
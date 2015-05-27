var expect = require('chai').expect;
var CsvToJsonConverter = require('../libs/converters/CsvToJsonConverter');

var comma_config = {
	field_seperator: ','
};
var semicolon_config = {
	field_seperator: ';'
};

var comma_converter;
var comma_csv;

var semicolon_converter;
var semicolon_csv;

describe( 'The csv to json convert', function() {
	beforeEach(function() {
		comma_converter = new CsvToJsonConverter(comma_config);
		comma_csv = (
			"key, o.key, o.value, key4\n" +
			"v, v2, v3, v4\n" +
			"v4, v3, v2, v\n"
		);

		semicolon_converter = new CsvToJsonConverter(semicolon_config);
		semicolon_csv = (
			"key; o.key; o.value; key4\n" +
			"v; v2; v3; v4\n" +
			"v4; v3; v2; v\n"
		);
	});

	it( 'should read the correct keys', function() {
		expect(comma_converter.keys(comma_csv).length).to.eq(4);
		expect(semicolon_converter.keys(semicolon_csv).length).to.eq(4);
	});

	it( 'should read the amount of rows correctly', function() {
		expect(comma_converter.rows(comma_csv).length).to.eq(2);
		expect(semicolon_converter.rows(semicolon_csv).length).to.eq(2);
	});

	it( 'should create the correct amount of objects', function() {
		expect(comma_converter.convert(comma_csv).length).to.eq(2);
		expect(semicolon_converter.convert(semicolon_csv).length).to.eq(2);
	});

	it( 'should create a correct first row', function() {
		var expected = {
			key: 'v',
			o: {
				key: 'v2',
				value: 'v3'
			},
			key4: 'v4'
		};
		var comma_obj = comma_converter.convert(comma_csv)[0];
		var semicolon_obj = semicolon_converter.convert(semicolon_csv)[0];

		expect(comma_obj['key']).to.be.ok.and.eq(expected['key']);
		expect(semicolon_obj['key']).to.be.ok.and.eq(expected['key']);

		expect(comma_obj['key4']).to.be.ok.and.eq(expected['key4']);
		expect(semicolon_obj['key4']).to.be.ok.and.eq(expected['key4']);

		expect(comma_obj['o']).to.be.ok;
		expect(semicolon_obj['o']).to.be.ok;

		expect(comma_obj['o']['key']).to.be.ok.and.eq(expected['o']['key']);
		expect(semicolon_obj['o']['key']).to.be.ok.and.eq(expected['o']['key']);

		expect(comma_obj['o']['value']).to.be.ok.and.eq(expected['o']['value']);
		expect(semicolon_obj['o']['value']).to.be.ok.and.eq(expected['o']['value']);
	});
});
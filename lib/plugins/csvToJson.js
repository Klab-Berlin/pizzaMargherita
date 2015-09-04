var fs = require('fs');
var Promise = require('q').Promise;
var pm = require('../../');
var plugin = {
	name: 'pizzaMargherita'
};
module.exports = plugin;

// app is a globally available namespace - your KMS-based application
plugin.init = function( app ) {
	return plugin;
};

var staticpath = __dirname + '/../uploads/';


// --- YOU NEED TO DEFINE YOUR RPC-ENDPOINTS/RESOURCE SO THE API CAN EXPLAIN IT TO CLIENTS AND ROUTE IT ACCORDINGLY
plugin.resourceDefinition = function( app ) {
	var rpc_configs = app.config.krabbit.rabbit.RPCS;
	var rpcs = app.krabbit.getRpcs();
	return {
		POST: {
			csvToJson: {
				name: 'csvToJson',
				type: 'rpc',
				routing: rpc_configs['csvToJson'].ROUTING,

				rpc: rpcs['csvToJson'],
				handler: plugin.handler.csvStringToJson,

				tests: [
					{
						description: "Should return two rows",
						data: {
							csv: "hello; bye\nworld; world\nPunga; Agnup\n"
						},
						check: [
							"chai.expect(data.length).to.eq(2)",
							"chai.expect(error).to.be.false"
						].join(';')
					},
					{
						description: "Should have two keys",
						data: {
							csv: "hello; bye\nworld; world\nPunga; Agnup\n"
						},
						check: [
							"chai.expect(Object.keys(data[0]).length).to.eq(2)",
							"chai.expect(error).to.be.false"
						].join(';')
					},
					{
						description: "Should have hello and bye as keys",
						data: {
							csv: "hello; bye\nworld; world\nPunga; Agnup\n"
						},
						check: [
							"chai.expect('hello' in data[0]).to.be.true",
							"chai.expect('bye' in data[0]).to.be.true",
							"chai.expect(error).to.be.false"
						].join(';')
					},
					{
						description: "First Row should have world, world as values",
						data: {
							csv: "hello; bye\nworld; world\nPunga; Agnup\n"
						},
						check: [
							"chai.expect(data[0].hello).to.eq('world')",
							"chai.expect(data[0].bye).to.eq('world')",
							"chai.expect(error).to.be.false"
						].join(';')
					},
					{
						description: "Should return nothing without data send",
						data: {
						},
						check: [
							"chai.expect(data.length).to.eq(0)",
							"chai.expect(error).to.be.false"
						].join(';')
					},
					{
						description: "Should throw an error with malformed csv",
						data: {
							csv: "hello, byse\nwas;asd;dsad;asd\n"
						},
						check: [
							"chai.expect(error).to.be.true",
							"chai.expect(data.length).to.eq(1)",
							"chai.expect(data[0].message).to.be.ok"
						].join(';')
					}
				],

				description: 'Converts the given csv to json',
				parameters: {
					csv: {
						description: 'the csv you want to have parsed',
						type: 'string',
						optional: false,
						example: "hello; bye\nworld; world\nPunga; Agnup\n"
					},
					fieldSeperator: {
						default: ';',
						optional: true,
						example: ';',
						type: 'string'
					}
				}
			},

			csvToJsonFromFile: {
				name: 'csvToJsonFromFile',
				type: 'rpc',
				routing: rpc_configs['csvToJsonFromFile'].ROUTING,

				rpc: rpcs['csvToJsonFromFile'],
				handler: [
					plugin.handler.writeCsvFile,
					plugin.handler.csvFileToString,
					plugin.handler.csvStringToJson,
					plugin.handler.deleteCsvFile
				],

				tests: [
					{
						description: "Should return something",
						data: {
							name: 'example.csv',
							src: [
								'data:text/csv;base64,Z2VuZGVyO2ZpcnN0TmFtZTtsYXN0TmFtZTtlbWFpbDtwYXNzd29yZDtzdWJqZWN0c1s7c3ViamVjd',
								'HNbO3N1YmplY3RzWztzdWJqZWN0c1s7c2Nob29sc1suc2Nob29sTmFtZTtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbFN',
								'0cmVldDtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbEFyZWFDb2RlO3NjaG9vbHNbLnNjaG9vbEFkZHJlc3Muc2Nob29sQ',
								'2l0eTtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbFN0YXRlO3NjaG9vbHNbLnNjaG9vbEFkZHJlc3Muc2Nob29sQ291bnR',
								'yeTttYXJrZXRpbmcubWFpbGluZ3MuY3VzdG9tZXIuZG91YmxlT3B0SW47c2Nob29sc1sudHlwZQpIZXJyO0JlbjtVdHplcm1hb',
								'm47YmVuQG51dHplcm1hbm4uY29tO3Bhc3N3b3JkMTIzO01hdGhlbWF0aWs7RnJhbnrDtnNpc2NoOztTcG9ydDtBQkMgU2Nob29',
								'sO1N0cmVldCBOYW1lOzIyMzQ1O0hhbWJ1cmc7SGFtYnVyZztEZXV0c2NobGFuZDtjb25maXJtZWQ7R3ltbmFzaXVtCg=='
							].join('')
						},
						check: [
							"chai.expect(data).to.be.ok",
							"chai.expect(error).to.be.false"
						].join(';')
					},
					{
						description: "Should return one row",
						data: {
							name: 'example.csv',
							src: [
								'data:text/csv;base64,Z2VuZGVyO2ZpcnN0TmFtZTtsYXN0TmFtZTtlbWFpbDtwYXNzd29yZDtzdWJqZWN0c1s7c3ViamVjd',
								'HNbO3N1YmplY3RzWztzdWJqZWN0c1s7c2Nob29sc1suc2Nob29sTmFtZTtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbFN',
								'0cmVldDtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbEFyZWFDb2RlO3NjaG9vbHNbLnNjaG9vbEFkZHJlc3Muc2Nob29sQ',
								'2l0eTtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbFN0YXRlO3NjaG9vbHNbLnNjaG9vbEFkZHJlc3Muc2Nob29sQ291bnR',
								'yeTttYXJrZXRpbmcubWFpbGluZ3MuY3VzdG9tZXIuZG91YmxlT3B0SW47c2Nob29sc1sudHlwZQpIZXJyO0JlbjtVdHplcm1hb',
								'm47YmVuQG51dHplcm1hbm4uY29tO3Bhc3N3b3JkMTIzO01hdGhlbWF0aWs7RnJhbnrDtnNpc2NoOztTcG9ydDtBQkMgU2Nob29',
								'sO1N0cmVldCBOYW1lOzIyMzQ1O0hhbWJ1cmc7SGFtYnVyZztEZXV0c2NobGFuZDtjb25maXJtZWQ7R3ltbmFzaXVtCg=='
							].join('')
						},
						check: [
							"chai.expect(data.length).to.eq(1)",
							"chai.expect(error).to.be.false"
						].join(';')
					},
					{
						description: "Should have 8 cells",
						data: {
							name: 'example.csv',
							src: [
								'data:text/csv;base64,Z2VuZGVyO2ZpcnN0TmFtZTtsYXN0TmFtZTtlbWFpbDtwYXNzd29yZDtzdWJqZWN0c1s7c3ViamVjd',
								'HNbO3N1YmplY3RzWztzdWJqZWN0c1s7c2Nob29sc1suc2Nob29sTmFtZTtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbFN',
								'0cmVldDtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbEFyZWFDb2RlO3NjaG9vbHNbLnNjaG9vbEFkZHJlc3Muc2Nob29sQ',
								'2l0eTtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbFN0YXRlO3NjaG9vbHNbLnNjaG9vbEFkZHJlc3Muc2Nob29sQ291bnR',
								'yeTttYXJrZXRpbmcubWFpbGluZ3MuY3VzdG9tZXIuZG91YmxlT3B0SW47c2Nob29sc1sudHlwZQpIZXJyO0JlbjtVdHplcm1hb',
								'm47YmVuQG51dHplcm1hbm4uY29tO3Bhc3N3b3JkMTIzO01hdGhlbWF0aWs7RnJhbnrDtnNpc2NoOztTcG9ydDtBQkMgU2Nob29',
								'sO1N0cmVldCBOYW1lOzIyMzQ1O0hhbWJ1cmc7SGFtYnVyZztEZXV0c2NobGFuZDtjb25maXJtZWQ7R3ltbmFzaXVtCg=='
							].join('')
						},
						check: [
							"chai.expect(Object.keys(data[0]).length).to.eq(8)",
							"chai.expect(error).to.be.false"
						].join(';')
					},
					{
						description: "Should have 'Ben' as firstName",
						data: {
							name: 'example.csv',
							src: [
								'data:text/csv;base64,Z2VuZGVyO2ZpcnN0TmFtZTtsYXN0TmFtZTtlbWFpbDtwYXNzd29yZDtzdWJqZWN0c1s7c3ViamVjd',
								'HNbO3N1YmplY3RzWztzdWJqZWN0c1s7c2Nob29sc1suc2Nob29sTmFtZTtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbFN',
								'0cmVldDtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbEFyZWFDb2RlO3NjaG9vbHNbLnNjaG9vbEFkZHJlc3Muc2Nob29sQ',
								'2l0eTtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbFN0YXRlO3NjaG9vbHNbLnNjaG9vbEFkZHJlc3Muc2Nob29sQ291bnR',
								'yeTttYXJrZXRpbmcubWFpbGluZ3MuY3VzdG9tZXIuZG91YmxlT3B0SW47c2Nob29sc1sudHlwZQpIZXJyO0JlbjtVdHplcm1hb',
								'm47YmVuQG51dHplcm1hbm4uY29tO3Bhc3N3b3JkMTIzO01hdGhlbWF0aWs7RnJhbnrDtnNpc2NoOztTcG9ydDtBQkMgU2Nob29',
								'sO1N0cmVldCBOYW1lOzIyMzQ1O0hhbWJ1cmc7SGFtYnVyZztEZXV0c2NobGFuZDtjb25maXJtZWQ7R3ltbmFzaXVtCg=='
							].join('')
						},
						check: [
							"chai.expect(data[0].firstName).to.eq('Ben')",
							"chai.expect(error).to.be.false"
						].join(';')
					},
					{
						description: "Should throw without src given.",
						data: {
							name: 'example.csv'
						},
						check: [
							"chai.expect(error).to.be.true",
							"chai.expect(data.length).to.eq(1)",
							"chai.expect(data[0].message).to.be.ok"
						].join(';')
					}
				],

				description: 'Parses the file and returns the csv parsed to json',
				parameters: {
					name: {
						description: 'the name of the uploaded csv file',
						type: 'string',
						example: 'myfile.csv',
						optional: false
					},
					src: {
						description: 'the csv files content as base64 string',
						type: 'string',
						example: [
							'data:text/csv;base64,Z2VuZGVyO2ZpcnN0TmFtZTtsYXN0TmFtZTtlbWFpbDtwYXNzd29yZDtzdWJqZWN0c1s7c3ViamVjd',
							'HNbO3N1YmplY3RzWztzdWJqZWN0c1s7c2Nob29sc1suc2Nob29sTmFtZTtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbFN',
							'0cmVldDtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbEFyZWFDb2RlO3NjaG9vbHNbLnNjaG9vbEFkZHJlc3Muc2Nob29sQ',
							'2l0eTtzY2hvb2xzWy5zY2hvb2xBZGRyZXNzLnNjaG9vbFN0YXRlO3NjaG9vbHNbLnNjaG9vbEFkZHJlc3Muc2Nob29sQ291bnR',
							'yeTttYXJrZXRpbmcubWFpbGluZ3MuY3VzdG9tZXIuZG91YmxlT3B0SW47c2Nob29sc1sudHlwZQpIZXJyO0JlbjtVdHplcm1hb',
							'm47YmVuQG51dHplcm1hbm4uY29tO3Bhc3N3b3JkMTIzO01hdGhlbWF0aWs7RnJhbnrDtnNpc2NoOztTcG9ydDtBQkMgU2Nob29',
							'sO1N0cmVldCBOYW1lOzIyMzQ1O0hhbWJ1cmc7SGFtYnVyZztEZXV0c2NobGFuZDtjb25maXJtZWQ7R3ltbmFzaXVtCg=='
						].join(''),
						optional: false
					},
					fieldSeperator: {
						default: ';',
						optional: true,
						example: ';',
						type: 'string'
					}
				}
			}
		}
	};
};

plugin.handler = {};

plugin.handler.writeCsvFile = function(context, next, reply, sendError) {
	var data = context.request.input.document;

	if( !data.src )
		return sendError('Please specify a src string.');

	if( !data.name )
		data.name = 'unnamed.csv';

	var filename = (
		data.name.replace(/^(.+)(?:\.)(.+)$/, '$1') +
		(new Date()).getTime() + "." +
		data.name.replace(/^(.+)(?:\.)(.+)$/, '$2')
	);

	fs.writeFile(
		staticpath + filename,
		data.src.substring(
          data.src.indexOf(',')+1
        ),
		"base64",
		function( error, result ) {
			if( error )
				return sendError( error, result );

			context.session.file = result;
			context.session.file_path = staticpath + filename;
			next();
		}
	);
};

plugin.handler.csvFileToString = function(context, next, reply, sendError) {
	fs.readFile(
		context.session.file_path,
		{
			encoding: 'utf8'
		},
		function( error, content ) {
			if( error ) {
				context.session.errors = [error];
				return next();
			}

			context.session.csv = content.toString();
			next();
		}
	);
};

plugin.handler.csvStringToJson = function(context, next, reply, sendError) {
	if(context.session.errors)
		return next();

	var converter = pm();
	var csvString =
		context.request.input.document.csv ||
		context.session.csv;

	context.response.message = csvString ? converter.csvToJson(csvString) : [];
	next();
};

plugin.handler.deleteCsvFile = function(context, next, reply, sendError) {
	fs.unlink(
		context.session.file_path,
		next
	);
};
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

	if( !data.name || !data.src )
		return sendError('Please specify a file name and src string.');

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
var fs = require('fs');
var Promise = require('q').Promise;
var pm = require('../../');
var staticpath = __dirname + '/../uploads/';

var plugin = {
	handler: {
		writeCsvFile: function(context, next, reply, sendError) {
			var data = context.request.document;

			if( !data.src )
				return sendError(new Error('Please specify a src string.'));

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
		},

		csvFileToString: function(context, next, reply, sendError) {
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
		},

		csvStringToJson: function(context, next, reply, sendError) {
			if(context.session.errors)
				return next();

			var converter = pm();
			var csvString =
				context.request.document.csv ||
				context.session.csv;

			context.response = csvString ? converter.csvToJson(csvString) : [];
			next();
		},

		deleteCsvFile: function(context, next, reply, sendError) {
			fs.unlink(
				context.session.file_path,
				next
			);
		}
	}
};

module.exports = function(microservice) {
	var p = microservice.createPlugin();

	p.addEndpoint(
		'POST',
		'csvToJson',
		{
			DESCRIPTION: 'Converts the given csv to json',
			WEB_ENDPOINT: true
		},
		plugin.handler.csvStringToJson
	);

	p.addEndpoint(
		'POST',
		'csvToJsonFromFile',
		{
			DESCRIPTION: 'Parses the file and returns the csv parsed to json',
			WEB_ENDPOINT: true
		},
		[
			plugin.handler.writeCsvFile,
			plugin.handler.csvFileToString,
			plugin.handler.csvStringToJson,
			plugin.handler.deleteCsvFile
		]
	);

	return p;
};
var Promise = require('q').Promise;
var pm = require('pizzaMargherita');
var plugin = {
	name: 'pizzaMargherita'
};
module.exports = plugin;

// app is a globally available namespace - your KMS-based application
plugin.init = function( app ) {
	return plugin;
};


// --- YOU NEED TO DEFINE YOUR RPC-ENDPOINTS/RESOURCE SO THE API CAN EXPLAIN IT TO CLIENTS AND ROUTE IT ACCORDINGLY
plugin.resourceDefinition = function( app ) {
	var rpc_configs = app.config.krabbit.rabbit.RPCS;
	var rpcs = app.rabbitMQService.getRpcs();
	return {
		POST: {
			jsonToCsv: {
				name: 'jsonToCsv',
				type: 'rpc',
				routing: rpc_configs['csvToJson'].ROUTING,

				rpc: rpcs['csvToJson'],
				handler: plugin.handler.csvToJson,

				description: 'Converts the given csv to json',
				parameters: {
					csv: {
						description: 'the csv you want to have parsed',
						type: 'string',
						optional: false,
						example: 'hello; bye;\nworld; world'
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

plugin.handler.csvFileToString = function(context, next, reply, sendError) {
	next();
};

plugin.handler.csvToJson = function(context, next, reply, sendError) {
	var converter = pm();
	var csvString =
		context.request.input.document.csv ||
		context.request.session.csv;
	context.response.message.json = converter.csvToJson(csvString);
	next();
};
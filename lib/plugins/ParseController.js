var Promise = require('q').Promise;

var plugin = {
	name: 'echo'
};
module.exports = plugin;

// app is a globally available namespace - your KMS-based application
plugin.init = function() {
	return plugin;
};


// --- YOU NEED TO DEFINE YOUR RPC-ENDPOINTS/RESOURCE SO THE API CAN EXPLAIN IT TO CLIENTS AND ROUTE IT ACCORDINGLY
plugin.resourceDefinition = function() {
	var rpcs = app.config.krabbit.rabbit.RPCS;
	return {
		csvToJson: {
			name: 'csvToJson',
			type: 'rpc',
			routing: rpcs['csvToJson'].ROUTING,

			rpc: rpcs['csvToJson'],
			handler: plugin.handler.csvToJson,

			parser: {
				POST: {
					csvToJson: {
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
			}
		},

		csvToJsonFromFile: {
			name: 'csvToJsonFromFile',
			type: 'rpc',
			routing: rpcs['csvToJsonFromFile'].ROUTING,

			rpc: rpcs['csvToJsonFromFile'],
			handler: [
				plugin.handler.csvFileToString,
				plugin.handler.csvToJson,
			]

			parser: {
				POST: {
					csvToJsonFromFile: {
						description: 'Parses the file and returns the csv parsed to json',
						parameters: {
							file: {
								description: 'the csv file that is to be parsed in base64',
								type: 'string',
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
			}
		}
	};
};

plugin.handler = {};

plugin.handler.csvFileToString = function(context, next, reply, sendError) {

};

plugin.handler.csvToJson = function(context, next, reply, sendError) {
};
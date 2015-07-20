var BunyanFormat = require('bunyan-format');
var config = {};
module.exports = config;

// --- BASICS; id should be 'unique' (for multiple instances), name general  (logging, ...)
config.id = 'pizzaMargherita_' + Date.now();
config.name = 'pizzaMargherita';

// --- DIRECTORIES
config.directories = {
	home: process.cwd(),
	plugins: process.cwd() + '/lib/plugins',
	config: process.cwd() + '/config',
	logs: process.cwd() + '/logs',
};

config.logOutStream = BunyanFormat({ outputMode: 'short' });

// --- PLUGINS
config.plugins = [];

// --- ECHO PLUGIN ... 
config.plugins.push(
	{
		name: 'csvToJson',
		file: config.directories.plugins + '/csvToJson.js'
	}
);

config.rmqConnection = {
	SERVER: {
		host: 'localhost',
		port: 5672,
		login: 'api.dev.mu.de',
		password: 'CHF2c8T1EpsLobmN9ZoU'
	},
	EXCHANGE: {
		name: 'amq.topic',
		type: 'topic',
		durable: true,
		autoDelete: true
	},
};

// --- K-RABBIT config ... 
config.krabbit = {
	consuela: {
		id: 'consuela',
		server: {
				host: 'localhost',
				port: 5672,
				login: 'api.dev.mu.de',
				password: 'CHF2c8T1EpsLobmN9ZoU'
		},
		exchange: {
				name: 'api-events',
				type: 'topic',
		},
		queue: 'consuela-messages-dev-rouven',
		routing: '#request.failed'
	},
	rabbit: {
	    QUEUES: {
	    },
	    RPCS: {
	    	csvToJson: {
				NAME: 'csvToJson',
				ROUTING: 'pizzaMargherita.POST.csvToJson',
				PARALLEL: true,
				CONNECTION: {
					SERVER: config.rmqConnection.SERVER
				}
			},
			csvToJsonFromFile: {
				NAME: 'csvToJsonFromFile',
				ROUTING: 'pizzaMargherita.POST.csvToJsonFromFile',
				PARALLEL: true,
				CONNECTION: {
					SERVER: config.rmqConnection.SERVER
				}
			}
		}
	},
	logger: {
		STREAMS: [
			{
				level: 'warn',
				type: 'file',
				path: config.directories.logs + '/krabbit.warn.log'
			},
			{
				level: 'debug',
				type: 'file',
				path: config.directories.logs + '/krabbit.debug.log'
			},
			{
				level: 'debug',
				type: 'stream',
				stream: process.stdout
			},
			{
				level: 'warn',
				type: 'stream',
				stream: process.stderr
			}
		]
	}
};


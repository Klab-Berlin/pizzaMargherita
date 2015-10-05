var base = require('./config');

var config = {};

config.rmqConnection = {
	SERVER: {
        	host: '192.168.1.140',
        	port: 5672,
        	login: 'tdev1',
        	password: 'mq4tdev1'
	},
	EXCHANGE: {
		name: 'amq.topic',
		type: 'topic',
		durable: true,
		autoDelete: true
	},
};

config.mode = 'rouven';

base(config);

config.logger = {
	name: config.name,
	streams: [
		{
			level: 'warn',
			stream: config.logOutStream
		}
	]
};

config.krabbit.logger.STREAMS = [
	// {
	// 	level: 'debug',
	// 	type: 'stream',
	// 	stream: process.stdout
	// },
	{
		level: 'warn',
		type: 'stream',
		stream: process.stderr
	}
];

module.exports = config;

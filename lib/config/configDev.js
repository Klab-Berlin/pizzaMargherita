var base = require('./config');

var config = {};

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

config.mode = 'dev';

base(config);

module.exports = config;
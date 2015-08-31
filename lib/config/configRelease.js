var base = require('./config');

var config = {};

config.rmqConnection = {
	SERVER: {
		host: 'rabbitmq.muit.org',
		port: 5671,
		login: 'klapi',
		password: '8yhxjpWC9jkMUtUcOG',
		ssl: {
			enabled: true,
			rejectUnauthorized: false
		}
	},
	EXCHANGE: {
		name: 'amq.topic',
		type: 'topic',
		durable: true,
		autoDelete: true
	},
};

config.mode = 'prod';

base(config);

module.exports = config;
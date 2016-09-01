var base = require('./config');

var config = {
	PROFILE: 'AWS-PRODUCTION'
};

base(config);

module.exports = config;
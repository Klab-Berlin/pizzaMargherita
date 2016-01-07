var BunyanFormat = require('bunyan-format');

module.exports = function( config ) {
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
};


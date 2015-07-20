var fs = require('fs');

module.exports = function readFile ( file, converter, callback ) {
	fs.readFile(
		file,
		{
			encoding: 'utf8'
		},
		function( error, content ) {
			if( error )
				return callback(error);

			content = content.toString();
			return callback( null, converter(content) );
		}
	);
};
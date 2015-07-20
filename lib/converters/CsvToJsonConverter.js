var defaults = {
	field_seperator: ';',
	row_seperator: '\n',
	member_seperator: '.',
	list_seperator: ','
};

var Converter = function( args ) {
	this.field_seperator = args && args.fieldSeperator || defaults.field_seperator;
	this.row_seperator = args && args.rowSeperator || defaults.row_seperator;
	this.member_seperator = args && args.memberSeperator || defaults.member_seperator;
	this.list_seperator = args && args.listSeperator || defaults.list_seperator;
};

Converter.prototype.convert = function( csv ) {
	var rows = this.rows(csv);
	var keys = this.keys(csv);

	console.log("Parsing %s rows with %s cells.", rows.length, keys.length);
	console.log("Keys: %s", keys);

	var result = [];
	for( var index in rows ) {
		console.log("Parsing row %s", index);
		var row = {};
		var cells = rows[index].split(this.field_seperator);
		for( var cell in cells ) {
			this._insert_value(row, keys[cell], cells[cell].trim());
		}
		result.push(row);
	}

	return result;
};

Converter.prototype._insert_value = function( row, key, value ) {
	var path = key.split('.');
	var into = row;
	for( var i = 0; i < path.length; i++ ) {
		var k = path[i];
		var is_array = k[k.length-1] == '[';
		if( is_array ) k = k.slice(0, -1);

		if( i == (path.length-1) )
			if( is_array ) {
				var values = value.split(this.list_seperator);

				if( !(into[k] instanceof Array) )
					into[k] = [];

				for( var index in values ) {
					var v = values[index].trim();
					if( v.length > 0 )
						into[k].push(values[index]);
				}
			} else {
				into[k] = value;
			}
		else {
			if( typeof into[k] !== 'object' )
				into[k] = is_array ? [{}] : {};

			into = is_array ? into[k][0] : into[k];
		}
	}
};

Converter.prototype.keys = function( csv ) {
	var head = csv.split(this.row_seperator)[0];
	return head.split(this.field_seperator).map(function(key) {
		return key.trim();
	});
};

Converter.prototype.rows = function( csv ) {
	return csv
		.split(this.row_seperator)
		.slice(1, -1)
		.filter(function(row) {
			return row.trim().length > 0;
		});
};

module.exports = Converter;
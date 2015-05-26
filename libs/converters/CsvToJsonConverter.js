var defaults = {
	field_seperator: ',',
	row_seperator: '\n',
	member_seperator: '.'
};

var Converter = function( args ) {
	this.field_seperator = args && args.field_seperator || defaults.field_seperator;
	this.row_seperator = args && args.row_seperator || defaults.row_seperator;
	this.member_seperator = args && args.member_seperator || defaults.member_seperator;
};

Converter.prototype.convert = function( csv ) {
	var rows = this.rows(csv);
	var keys = this.keys(csv);

	var result = [];
	for( var index in rows ) {
		var row = {};
		var cells = rows[index].split(this.field_seperator);
		for( var cell in cells ) {
			row[keys[cell]] = cells[cell].trim();
		}
		result.push(row);
	}

	return result;
};

Converter.prototype.keys = function( csv ) {
	var head = csv.split(this.row_seperator)[0];
	return head.split(this.field_seperator).map(function(key) {
		return key.trim();
	});
};

Converter.prototype.rows = function( csv ) {
	return csv.split(this.row_seperator).slice(1);
};

module.exports = Converter;
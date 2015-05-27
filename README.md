# pizzaMargherita
a small nodejs lib that takes json and turns it into .csv
or takes your .csv and turns it into json!

## Features

General
* Converts Json objects and csv files
* Reads and Converts files for you

Converter from JSON to CSV supporting:
* fields having nested objects
* fields having array of simple types
* fields having array of objects --> data replaced with Array({size_of_the_array})

Converter from CSV to JSON supporting:
* fields having nested objects

## Instructions

Simply require pizzaMargherita in your project and innitialize it with your csv
configurations. You get a converter in return that you can use to convert objects
in plain javascript or reads them from a file for you.

	var pizzaMargherita = require('pizzaMargherita');
	var convert = pizzaMargherita({
		field_seperator: ','
	});

	convert.csvToJsonFromFile('/myfile.csv', function( error, result ) {
		if( error )
			return console.error('Oh crap.');

		console.log('My json object converted from the csv file: ', result );
	});

## Config
| key | default | description |
|-----|---------|-------------|
| fieldSeperator | ; | Seperator of columns |
| listSeperator | , | Seperator of values in an array column |
| rowSepereator | \n | Seperator of rows |
| memberSeperator | . | Seperator of object members for nested objects |

## Api

| method | description |
|--------|-------------|
| csvToJson( csv_string: String ): Object | Reads a csv string and returns a Json object |
| jsonToCsv( json_object: Object ): String | Reads Json Object and Retruns a csv string |
| csvToJsonFromFile( file:String, callback:Function ): undefined | Reads a csv file and calls callback with a JsonObject as the second paramter or and error as the first parameter |
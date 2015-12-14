var config = require(__dirname + '/' + process.argv[2]);
var kmicroservice = require('kmicroservice');

var microservice = new kmicroservice('pizzaMargherita', config);
var plugin = require('./lib/plugins/csvToJson')(microservice);

microservice.start();
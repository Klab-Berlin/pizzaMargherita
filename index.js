var configName = 'config' + process.env.NODE_ENV;
var config = require(__dirname + '/lib/config/' + configName);
var kmicroservice = require('kmicroservice');

var microservice = new kmicroservice('pizzaMargherita', config);
var plugin = require('./lib/plugins/csvToJson')(microservice);

microservice.start();
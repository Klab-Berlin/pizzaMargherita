var KMS = require('../kmicroservice');

var startup = KMS()
	.then(
		function() {
			console.log('========= INIT COMPLETE ============');
			console.log(arguments);
		},
		function() {
			console.log('========= INIT FAIL ============');
			console.log(arguments);
		}
	);
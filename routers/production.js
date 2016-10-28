var express = require('express');
var router = express.Router();

// router.get for production view

// console.log('in production router');
// router.post for production table
router.post ('/production', function (req, res){
	console.log ('req.body for client is', req.body);
	var client = req.body;
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('connection error in client', client);
		} else {
			var queryResults = client.query ('INSERT INTO production (contract_id, talent, who, what, site, why, cart_number) '+
																				'VALUES ($1, $2, $3, $4, $5, $6, $7)' ,
																			[production]);
		}
		queryResults.on('end', function(){
			done();
			res.send({success: true});
		});//end queryResults for client table
	});//end pg.connect for client table
});//end router.post for client table

module.exports = router;

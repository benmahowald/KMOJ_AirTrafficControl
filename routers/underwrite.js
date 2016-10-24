var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = 'postgres://localhost:5432/kmoj';

// console.log('in underwrite router');
//router.post master
router.post ('/underwrite', function (req, res){
	console.log('req.body is', req.body);
	var master = req.body;
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('connection error in master' err);
		} else {
			var queryResults = client.query ('INSERT INTO master (users_id, client_id, sign_date, event_name, spot_number, total_cost) ' +
																				('interviews, socialmedia, instructions, man_app, uw_app, pr_app, tr_app, spot_type, ' +
																				('spot_length, spot_rate, total_spots, flight_id, prod_id, copy_id ' +
																				('VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)' ,
																			  [master]))));
		}
		queryResults.on('end', function(){
			done();
			res.send({success: true});
		});//end queryResults
	});//end pg.connect
});//end router.post

module.exports = router;

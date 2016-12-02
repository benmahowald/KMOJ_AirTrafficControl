var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = 'postgres://localhost:5432/kmoj';
var nodemailer = require ('nodemailer');

router.get('/contractsPending', function (req, res){
	console.log('in get contract');
	pg.connect(connectionString, function(err, client, done){
		if(err){
			console.log('get contract connection error is', err);
		} else {
			var results = [];
			var queryResults = client.query ('SELECT * FROM master WHERE man_app=(true) AND pr_app=(false)');
			queryResults.on('row', function(row){
				results.push(row);
			});
			queryResults.on('end', function(){
				done();
				console.log('contract results are', results);
				res.json(results);
			});//end queryResults for contractspending
		}
	}); //end pg.connect for contractspending
});//end router contractspending

// router.get for production view
router.get('/productionInfo', function (req, res){
	console.log('in get production Info');
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in productionInfo');
		} else {
			var results = [];
			var queryResults = client.query('SELECT master.id AS contract_id, flight.start_date, flight.end_date, clients.name AS client_name, master.event_name, users.name AS uw_name FROM flight JOIN master ON flight.contract_id = master.id JOIN clients ON clients.client_id = master.client_id JOIN production ON production.contract_id = master.id INNER JOIN users ON master.users_id = users.id WHERE master.pr_app = false');
			queryResults.on('row', function(row){
				results.push(row);
				console.log('productionInfo row is ', row);
			});//end queryResults.on 'row'
			queryResults.on('end', function(){
				done();
				console.log('results are', results);
				return res.json(results);
			});//end queryResults on 'end'
		}
	});//end pg.connect for production info
});//end router.get for production info

// router.post for production table
// router.post ('/production', function (req, res){
// 	console.log ('req.body for client is', req.body);
// 	console.log (req.query.q);
// 	var client = req.body;
// 	pg.connect(connectionString, function (err, client, done){
// 		console.log('In production right now');
// 		if (err){
// 			console.log('connection error in client', client);
// 		} else {
// 			console.log('in the else now');
// 			var queryResults = client.query ('INSERT INTO production (contract_id, talent, who, what, site, why, cart_number, producer, complete_date) ' +
// 			'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
// 			[req.body.contract_id, req.body.talent, req.body.who, req.body.what,
// 				req.body.site, req.body.why, req.body.cart_number, req.body.producer, req.body.complete_date]);
//
// 				queryResults.on('end', function(){
// 					var queryResults = client.query ('UPDATE master SET pr_app = (true) WHERE master.id = ($1)',
// 					[req.body.contract_id]);
// 					////sends an email to GM, UW and Bookkeeper generating invoice////
// 					// invoiceMail();
// 					done();
// 					res.send({success: true});
// 				});//end queryResults.on end
// 			}//end else
// 		});//end pg.connect for production table
// 	});//end router.post for production table



module.exports = router;

var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = 'postgres://localhost:5432/kmoj';

// router.get for production view
router.get('/productionInfo', function (req, res){
	console.log('in get production Info');
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in productionInfo');
		} else {
			var results = [];
			var queryResults = client.query('SELECT master.id, flight.start_date, flight.end_date, clients.name, clients.contact, clients.phone, clients.address, production.talent, production.producer, master.event_name, master.spot_length,users.name FROM flight INNER JOIN master ON master.flight_id = flight.id INNER JOIN clients ON clients.client_id = master.client_id INNER JOIN production ON production.contract_id = master.id INNER JOIN users ON master.users_id = users.id WHERE pr_app IS false;');
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


// console.log('in production router');
// router.post for production table
router.post ('/production', function (req, res){
	console.log ('req.body for client is', req.body);
	console.log (req.query.q);
	var client = req.body;
	pg.connect(connectionString, function (err, client, done){
		console.log('In production right now');
		if (err){
			console.log('connection error in client', client);
		} else {
			console.log('in the else now');
			var queryResults = client.query ('INSERT INTO production (contract_id, talent, who, what, site, why, cart_number, producer, complete_date, spot_length) ' +
			'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
			[req.body.contract_id, req.body.talent, req.body.who, req.body.what,
				req.body.site, req.body.why, req.body.cart_number, req.body.producer, req.body.complete_date, req.body.spot_length]);
			}
			queryResults.on('end', function(){
				var queryResults = client.query ('UPDATE master SET pr_app = 'true' WHERE master.id = ($1)',
				[req.body.contract_id]);
				}
				queryResults.on('end', function(){
					done();
					res.send({success: true});
				});
			});//end queryResults for client table

		});//end pg.connect for client table
	});//end router.post for client table

	module.exports = router;

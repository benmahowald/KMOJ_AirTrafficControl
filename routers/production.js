var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = 'postgres://localhost:5432/kmoj';

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

//get production info from db for production
router.get('/productioninfo', function (req, res){
	console.log('in get production info');
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in production info');
		} else {
			var results = [];
			var queryResults = client.query('SELECT flight.start_date, flight.end_date, clients.name, clients.contact') +
			 															 ('clients.phone, clients.address, production.talent, production.producer') +
																		 ('master.event_name, master.spot_length FROM flight INNER JOIN clients') +
																		 ('ON clients.client_id = flight.id INNER JOIN production ON production.id = flight.id') +
																		 ('INNER JOIN master ON master.id = flight.id');
					queryResults.on('row', function(row){
	 					  results.push(row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						  done();
							return res.json(results);
				  		console.log('results are', results);
					});//end queryResults on 'end'
		}
	});//end pg.connect for getting production info
});//end router.get for getting production info


module.exports = router;

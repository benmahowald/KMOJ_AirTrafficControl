var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = 'postgres://localhost:5432/kmoj';

// console.log('in underwrite router');
//router.post client
router.post ('/client', function (req, res){
	console.log ('req.body for client is', req.body);
	var client = req.body;
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('connection error in client', client);
		} else {
			var queryResults = client.query ('INSERT INTO clients (name, contact, address, city, state, zip, phone, cell, fax, email, webiste, user_id) '+
																				'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)' ,
																			[clients]);
		}
		queryResults.on('end', function(){
			done();
			res.send({success: true});
		});//end queryResults for client table
	});//end pg.connect for client table
});//end router.post for client table

//router.post master

router.post ('/master', function (req, res){
	console.log('req.body is', req.body);
	var master = req.body;
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('connection error in master', err);
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
});//end router.post for master table


// get information from db for contract view
router.get ('/contract', function (req, res){
	console.log('in get contract');
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('error in get contract info');
		} else {
			var results = [];
			var queryResults = client.query ('SELECT master.total_spots, master.spot_length, master.total_cost, master.interviews, master.socialmedia, master.sign_date, clients.name' +
			 																 'FROM master INNER JOIN clients ON clients.client_id = master.client_id');
					queryResults.on('row', function (row){
						results.push(row)
					});//end queryResults on row
					queryResults.on('end', function (){
						done();
						res.send.json(results);
						console.log('results for get contract info', results);
					});//end queryResults on end
		}
	});//end pg.connect for contract
});//end router.get for contract



module.exports = router;

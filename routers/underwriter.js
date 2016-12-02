var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var nodemailer = require ('nodemailer');
var connectionString = 'postgres://localhost:5432/kmoj';

// console.log('in underwrite router');

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

			queryResults.on('end', function(){
				done();
				res.send({success: true});

			});//end queryResults for client table
		}
	});//end pg.connect for client table
});//end router.post for client table

router.post ('/master', function (req, res){
	console.log('req.body is', req.body);
	var master = req.body;
	var spotType;
	if (master.psa) {
		spotType = 'PSA';
	} else if (master.fa) {
		spotType = 'FA';
	} else {
		spotType = '';
	}
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('connection error in master', err);
		} else {
			var master_id = [];
			// STILL NEED TO SEND: TOTAL_SPOTS
			console.log('line 71 before master INSERT');
			var queryResultsA = client.query ('INSERT INTO master (users_id, client_id, event_name, ' +
			'instructions, uw_submit, man_app, uw_app, pr_app, tr_app, spot_type, sign_date, interviews, total_cost, spot_rate, discounts, commission, socialmedia) ' +
			'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id;' ,
			[master.user_id, master.client_id,  master.event_name,  master.instructions,
				true, false, false, false, false, spotType, master.signDate, master.numInterviews, master.totalCost, master.spot_rate, master.discount, master.agency_commission, master.numSocialMedia]);

				queryResultsA.on('row', function(row){
					master_id.push(row);

				});//end queryResultsA.on 'row'
				queryResultsA.on('end', function(){
					console.log('master_id', master_id);
					var flight_id = [];


					console.log('flight info: ', master_id[0].id, master.start_date,  master.end_date);
					var queryResultsB = client.query ('INSERT INTO flight (' +
					'contract_id, start_date, end_date) ' +
					'VALUES ($1, $2, $3) RETURNING id;' ,
					[master_id[0].id, master.start_date,  master.end_date]);

					queryResultsB.on('row', function(row){
						flight_id.push(row);

					});//end queryResultsB.on 'row'
					queryResultsB.on('end', function(){

								console.log('flight_id', flight_id);

								var slotQuery = '';
								var queryArray = [];
								var thisSlot;

								for (var i = 0; i < master.slotInfo.length; i++) {
									thisSlot = master.slotInfo[i];
									slotQuery = 'INSERT INTO slots (day_of_run, plays, slot, flight_id) ' +
									'VALUES ($1, $2, $3, $4);';
									console.log('slotQuery:', slotQuery);
									queryArray = [thisSlot.dayOfRun, thisSlot.plays, thisSlot.slot, flight_id[0].id];

									var queryResultsSlot = client.query (slotQuery , queryArray);

									// This function within a loop is necessary to end each slotQuery
									// and only send the e-mail when all slots have been entered
									queryResultsSlot.on('end', function(){
										if (i === master.slotInfo.length-1){
											///send an email to GM saying new contract has been generated////
											managerMail();
											done();
											res.send({success: true});
										}
									});//end queryResultsSlot
								}


						});//end queryResultsB

					});//end queryResultsA
					res.sendStatus(200);
				}
			});//end pg.connect
		});//end router.post for master table

		//get underwriter info from db for underwriter
		router.get('/underwriterinfo', function (req, res){
			console.log('in get underwriter info');
			pg.connect(connectionString, function(err, client, done){
				if (err){
					console.log('connection err in underwriterinfo');
				} else {
					var results = [];
					var queryResults = client.query('SELECT flight.start_date, flight.end_date, slots.slot, slots.day_of_run, slots.plays, master.discounts') +
					('master.commission, master.spot_length, master.spot_type, master.copy_id, master.total_spots, master.spot_rate') +
					('master.total_cost, clients.name, users.name FROM flight INNER JOIN slots ON slots.id = flight.id') +
					('INNER JOIN master ON master.id = flight.id INNER JOIN clients ON clients.client_id = flight.id INNER JOIN users ON users.id = flight.id;');
					queryResults.on('row', function(row){
						results.push(row);

					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						done();
						console.log('results are', results);
						return res.json(results);
					});//end queryResults on 'end'
				}
			});//end pg.connect for underwriter info
		});//end router.get for underwriter info

		router.delete('/deleteClient', function (req, res){
			console.log('hit client delete route');
			console.log('client delete query is:', req.query.q);
			pg.connect(connectionString, function(err, client, done){
				if (err){
					console.log('connection err in delete client');
				} else {
					var queryResults = client.query('DELETE FROM clients WHERE name=($1)', [req.query.q]);
					queryResults.on('row', function(row){
						results.push(row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						done();
						res.send(200);
					});//end queryResults on 'end'
				} // end else
			});//end pg.connect
		}); // end delete client


	module.exports = router;

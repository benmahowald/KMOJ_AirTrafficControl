var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var nodemailer = require ('nodemailer');
var connectionString = 'postgres://localhost:5432/kmoj';

console.log('in underwrite router');

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

//router.post master
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'kmojatc@gmail.com',
		pass: 'manager@kmoj'
	}
});

var managerMail = transporter.sendMail({
	from: 'kmojatc@gmail.com',
	to: 'kmojproject@gmail.com',
	subject: 'New contract added to queue!',
	text: 'Please go to Air Traffic Controller to approve a new contract!'
}, function (err, res){
	if (err){
		console.log('error sending mail', err);
	} else {
		console.log('message sent ', res.message);
	}
	transporter.close();
});

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
			// STILL NEED TO SEND: SIGN_DATE, TOTAL_COST, SPOT_LENGTH, SPOT_RATE, TOTAL_SPOTS, discounts, commission
			var queryResultsA = client.query ('INSERT INTO master (users_id, client_id, event_name, ' +
			'instructions, uw_submit, man_app, uw_app, pr_app, tr_app, spot_type, sign_date) ' +
			'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;' ,
			[master.user_id, master.client_id,  master.event_name,  master.instructions,
				true, false, false, false, false, spotType, master.signDate]);

				queryResultsA.on('row', function(row){
					master_id.push(row);

				});//end queryResultsA.on 'row'
				queryResultsA.on('end', function(){
					console.log('master_id', master_id);
					var flight_id = [];

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
						var queryElement = 1;
						var thisSlot;

						for (var i = 0; i < master.slotInfo.length; i++) {
							thisSlot = master.slotInfo[i];
							slotQuery = 'INSERT INTO slots (day_of_run, plays, slot, flight_id) ' +
							'VALUES ($'+queryElement+', $'+(queryElement+1)+', $'+(queryElement+2)+', $'+(queryElement+3)+'); ';
							console.log('slotQuery:', slotQuery);
							queryArray = [thisSlot.dayOfRun, thisSlot.plays, thisSlot.slot, flight_id[0].id];

							var queryResultsSlot = client.query (slotQuery , queryArray);

							queryResultsSlot.on('end', function(){
								if (i === master.slotInfo.length-1){
	 							managerMail();
								done();
								res.send({success: true});
							}
						});//end queryResultsSlot
						}



					});//end queryResultsB

				});//end queryResultsA
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
					//send mail to production and traffic alert that a new contract has been generated.
					protraffMail();
					done();
					console.log('results are', results);
					return res.json(results);
				});//end queryResults on 'end'
			}
		});//end pg.connect for underwriter info
	});//end router.get for underwriter info



	module.exports = router;

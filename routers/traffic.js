var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var nodemailer = require ('nodemailer');
var connectionString = 'postgres://localhost:5432/kmoj';

// console.log('in traffic router');
//router.post slots
router.post ('/slots', function (req, res){
	console.log ('req.body for slots is', req.body);
	var slots = req.body;
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('connection error in slots', slots);
		} else {
			// first DELETE all the associated slots
			// then insert the new slot info

			var queryResults = client.query('DELETE FROM slots WHERE flight_id=(SELECT id from flight WHERE contract_id = ($1))', [slots.contract_id]);
			queryResults.on('end', function(){
				var slotQuery = 'INSERT INTO slots (day_of_run, plays, slot, flight_id) ' +
				'VALUES ($1, $2, $3, (SELECT id from flight WHERE contract_id = ($4)));';
				var queryArray = [];
				var thisSlot;
				var queryUpdateSlot;
				for (var i = 0; i < slots.slotInfo.length; i++) {
					thisSlot = slots.slotInfo[i];
					console.log('slotQuery:', slotQuery, i);
					queryArray = [thisSlot.dayOfRun, thisSlot.plays, thisSlot.slot, slots.contract_id];
					queryUpdateSlot = client.query (slotQuery , queryArray);
					// This function within a loop is necessary to end each slotQuery
					// and only send the e-mail when all slots have been entered

				} // end for loop
				queryUpdateSlot.on('end', function(){
						done();
						res.send({success: true});
				});//end queryUpdateSlot
			});//end queryResults on 'end'

		} // end else

	});//end pg.connect for slots table
});//end router.post for slots table

//get slots info
router.get('/getslots', function (req, res){
	console.log('in get slots');
	pg.connect(connectionString, function(err, client, done){
		if(err){
			console.log('get slots connection error is', err);
		} else {
			var results = [];
			var queryResults = client.query ('SELECT * FROM slots');
			queryResults.on('row', function(row){
				results.push(row);
			});
			queryResults.on('end', function(){
				done();
				console.log('slots results are', results);
				return res.json(results);
			});//end query results for getslots
		}
	}); //end pg.connect for getslots
});//end router.getslots

//get the flight info

router.get('/contractsPending', function (req, res){
	console.log('in get contract');
	pg.connect(connectionString, function(err, client, done){
		if(err){
			console.log('get contract connection error is', err);
		} else {
			var results = [];
			var queryResults = client.query ('SELECT * FROM master WHERE man_app=(true) AND tr_app=(false)');
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

router.get('/flightContract', function (req, res){
	console.log('in get contract -------------------');
	console.log('req.query', req.query);
	pg.connect(connectionString, function(err, client, done){
		if(err){
			console.log('get contract connection error is', err);
		} else {
			var results = [];
			var queryResults = client.query('SELECT flight.id, flight.cart_number, flight.start_date, flight.end_date, slots.day_of_run, slots.plays, slots.slot FROM flight JOIN slots on flight.id=slots.flight_id WHERE contract_id=($1);', [req.query.q]);
			queryResults.on('row', function(row){
				results.push(row);
			});
			queryResults.on('end', function(){
				done();
				console.log('flightContract results are', results);
				return res.json(results);
			});//end queryResults for contractspending
		}
	}); //end pg.connect for contractspending
});//end router contractspending

//get invoice info from db for invoice
router.get('/invoice', function (req, res){
	console.log('in get invoice info');
	console.log('req.body',req.body);
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in invoice info');
		} else {
			var results = [];
			var queryResults = client.query('SELECT  master.event_name, users.name AS users_name, master.total_spots, master.total_cost, master.discounts, master.commission, flight.start_date, flight.end_date, master.spot_length, master.spot_type, master.spot_rate, master.copy_id, slots.slot, slots.day_of_run, clients.name AS clients_name FROM master INNER JOIN slots ON slots.flight_id = master.flight_id INNER JOIN flight ON flight.contract_id = master.id INNER JOIN clients ON clients.client_id = master.client_id INNER JOIN users ON users.id = master.users_id');
			queryResults.on('row', function(row){
				results.push(row);
				// console.log('row=================', row)
			});//end queryResults.on 'row'
			queryResults.on('end', function(){
				done();
				console.log('INVOICE results are', results);
				return res.json(results);
			});//end queryResults on 'end'
		}
	});//end pg.connect for invoice info
});//end router.get for invoice info

router.put('/approval', function (req, res){
	console.log('get approval route hit ----------------');
	console.log('req.query.q', req.query.q);
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in clientinfo');
		} else {
			var results = [];
			var queryResults = client.query('UPDATE master SET tr_app=(true) WHERE id=($1)', [req.query.q]);
			queryResults.on('row', function(row){
				results.push(row);
			});//end queryResults.on 'row'
			queryResults.on('end', function(){
				done();
				console.log('results are', results);
				return res.json(results);
			});//end queryResults on 'end'
		} // end first else
	});//end pg.connect for client info
});//end router.put for client info

router.get('/cart_number', function (req, res){
	console.log('in get flight cart_number', req.query.q);
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in invoice info');
		} else {
			var results = [];
			var queryResults = client.query('SELECT cart_number FROM flight WHERE contract_id=($1)', [req.query.q]);
			queryResults.on('row', function(row){
				results.push(row);
			});//end queryResults.on 'row'
			queryResults.on('end', function(){
				done();
				console.log('results are', results);
				return res.json(results);
			});//end queryResults on 'end'
		}
	});//end pg.connect for invoice info
});//end router.get for invoice info

router.put('/cart_number', function (req, res){
	console.log('in put cart_number');
	console.log('req.body', req.body + 'req.query.q =', req.query.q);
	console.log('req = ', req.body.cart_number);
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in /cart_number');
		} else {
			var results = [];
			var queryResults = client.query('UPDATE flight set cart_number=($1) WHERE contract_id=($2)', [req.body.cart_number, req.query.q]);
			queryResults.on('row', function(row){
				results.push(row);
			});//end queryResults.on 'row'
			queryResults.on('end', function(){
				done();
				console.log('results are', results);
				return res.json(results);
			});//end queryResults on 'end'
		}
	});//end pg.connect for invoice info
});//end router.get for invoice info

module.exports = router;

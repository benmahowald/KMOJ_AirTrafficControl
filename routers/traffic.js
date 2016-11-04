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
			var queryResults = client.query ('INSERT INTO slots (day_of_run, plays, slot, flight_id,) '+
																				'VALUES ($1, $2, $3, $4)' ,
																			[req.body.day_of_run, req.body.plays, req.body.slot, req.body.flight_id]);
		}
		queryResults.on('end', function(){
			done();
			res.send({success: true});
		});//end queryResults for slots table
	});//end pg.connect for slots table
});//end router.post for slots table


// console.log('in traffic router');
//router.post media (interviews, socialmedia)
router.post ('/media', function (req, res){
	console.log ('req.body for media is', req.body);
	var media = req.body;
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('connection error in media', media);
		} else {
			var queryResults = client.query ('INSERT INTO master (interviews, socialmedia, man_app, uw_app, pr_app, tr_app) '+
																				'VALUES ($1, $2, $3, $4, $5, $6) WHERE users_id = ($1)' ,
																			[req.body.interviews, req.body.socialmedia, req.body.man_app, req.body.uw_app, req.body.pr_app, req.body.tr_app]);
		}
		queryResults.on('end', function(){
			done();
			res.send({success: true});

		});//end queryResults for media table
	});//end pg.connect for media table
});//end router.post for media table


//router.post flights

router.post ('/flight', function (req, res){
	console.log ('req.body for flight is', req.body);
	var flight = req.body;
	pg.connect(connectionString, function (err, flight, done){
		if (err){
			console.log('connection error in flight', flight);
		} else {
			var queryResults = flight.query ('INSERT INTO flight (contract_id, start_date, end_date, cart_number,) '+
																				'VALUES ($1, $2, $3, $4)' ,
																			[flight]);
		}
		queryResults.on('end', function(){
			done();
			res.send({success: true});
		});//end queryResults for flight table
	});//end pg.connect for flight table
});//end router.post for flight table

//get traffic info from db for traffic
router.get('/trafficinfo', function (req, res){
	console.log('in get traffic info');
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in trafficinfo');
		} else {
			var results = [];
			var queryResults = client.query('SELECT master.event_name, master.total_cost, master.sign_date, master.interviews, master.socialmedia, master.instructions, master.spot_type, master.spot_length, master.spot_rate, master.total_spots, users.name FROM master ' +
																			'INNER JOIN users ON users.id = master.users_id;');
					queryResults.on('row', function(row){
						results.push(row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						done();
						return res.json(results);
						console.log('results are', results);
					});//end queryResults on 'end'
		}
	});//end pg.connect for traffic info
});//end router.get for traffic info

//get client info from db for traffic

router.get('/clientinfo', function (req, res){
	console.log('in get client info');
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in clientinfo');
		} else {
			var results = [];
			var queryResults = client.query('SELECT * FROM clients');
					queryResults.on('row', function(row){
						results.push(row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						done();
						return res.json(results);
						console.log('results are', results);
					});//end queryResults on 'end'
		}
	});//end pg.connect for traffic info
});//end router.get for traffic info

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
				return res.json(results);
				console.log('slots results are', results);
			});//end query results for getslots
		}
	}); //end pg.connect for getslots
});//end router.getslots

//get the flight info

router.get('/getflight', function (req, res){
	console.log('in get flight');
	pg.connect(connectionString, function(err, client, done){
		if(err){
			console.log('get flight connection error is', err);
		} else {
			var results = [];
			var queryResults = client.query ('SELECT * FROM flight');
			queryResults.on('row', function(row){
				results.push(row);
			});
			queryResults.on('end', function(){
				done();
				return res.json(results);
				console.log('flight results are', results);
			});//end queryResults for getflight
		}
	}); //end pg.connect for get flight
});//end router.getflight



//get invoice info from db for invoice
router.get('/invoice', function (req, res){
	console.log('in get invoice info');
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in invoice info');
		} else {
			var results = [];
			var queryResults = client.query('SELECT  master.event_name, users.name, master.total_spots, master.total_cost, master.discounts, master.commission, flight.start_date, flight.end_date, master.spot_length, master.spot_type, master.spot_rate, master.copy_id, slots.slot, slots.day_of_run, clients.name FROM master INNER JOIN slots ON slots.id = master.id INNER JOIN flight ON flight.contract_id = master.id INNER JOIN clients ON clients.client_id = master.id INNER JOIN users ON users.id = master.id');
				  queryResults.on('row', function(row){
						results.push(row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						done();
						return res.json(results);
						console.log('results are', results);
					});//end queryResults on 'end'
		}
	});//end pg.connect for invoice info
});//end router.get for invoice info


module.exports = router;

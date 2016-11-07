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

		queryResults.on('end', function(){
			done();
			res.send({success: true});
		});//end queryResults for slots table

			} // end else

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

		queryResults.on('end', function(){
			done();
			res.send({success: true});

		});//end queryResults for media table
		} // end else
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

		queryResults.on('end', function(){
			done();
			res.send({success: true});
		});//end queryResults for flight table

		} // end else
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
						console.log('results are', results);
						return res.json(results);
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
						console.log('results are', results);
						return res.json(results);
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
				console.log('slots results are', results);
				return res.json(results);
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
				console.log('flight results are', results);
				return res.json(results);
			});//end queryResults for getflight
		}
	}); //end pg.connect for get flight
});//end router.getflight

router.get('/contractspending', function (req, res){
	console.log('in get contract');
	pg.connect(connectionString, function(err, client, done){
		if(err){
			console.log('get contract connection error is', err);
		} else {
			var results = [];
			var queryResults = client.query ('SELECT * FROM master WHERE man_app=(false) AND tr_app=(false)');
			queryResults.on('row', function(row){
				results.push(row);
			});
			queryResults.on('end', function(){
				done();
				// console.log('contract results are', results);
				return res.json(results);
			});//end queryResults for contractspending
		}
	}); //end pg.connect for contractspending
});//end router contractspending

router.get('/flightContract', function (req, res){
	console.log('in get contract -------------------');
	console.log('req.query.q', req.query.q);
	pg.connect(connectionString, function(err, client, done){
		if(err){
			console.log('get contract connection error is', err);
		} else {
			var results = [];
			var queryResults = client.query('SELECT start_date, end_date FROM flight WHERE contract_id=($1)', [req.query.q]);
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
			var queryResults = client.query('SELECT  master.event_name, users.name AS users_name, master.total_spots, master.total_cost, master.discounts, master.commission, flight.start_date, flight.end_date, master.spot_length, master.spot_type, master.spot_rate, master.copy_id, slots.slot, slots.day_of_run, clients.name FROM master INNER JOIN slots ON slots.flight_id = master.flight_id INNER JOIN flight ON flight.contract_id = master.id INNER JOIN clients ON clients.client_id = master.client_id INNER JOIN users ON users.id = master.users_id');
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
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in invoice info');
		} else {
			var results = [];
			var queryResults = client.query('UPDATE flight set cart_number=($1) WHERE contract_id=($2)', [req.body[0].cart_number, req.query.q]);
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

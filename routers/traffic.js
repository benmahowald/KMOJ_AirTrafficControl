var express = require('express');
var router = express.Router();

// console.log('in traffic router');
//router.post slots
router.post ('/slots', function (req, res){
	console.log ('req.body for slots is', req.body);
	var slots = req.body;
	pg.connect(connectionString, function (err, slots, done){
		if (err){
			console.log('connection error in slots', slots);
		} else {
			var queryResults = slots.query ('INSERT INTO slots (day_of_run, plays, slot, flight_id,) '+
																				'VALUES ($1, $2, $3, $4)' ,
																			[slots]);
		}
		queryResults.on('end', function(){
			done();
			res.send({success: true});
		});//end queryResults for slots table
	});//end pg.connect for slots table
});//end router.post for slots table

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




module.exports = router;

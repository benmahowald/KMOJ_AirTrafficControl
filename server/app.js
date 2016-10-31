var firebase = require('firebase');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require ('pg');
var connectionString = 'postgres://localhost:5432/kmoj';
var urlencodedParser = bodyParser.urlencoded({extended: false});
console.log('connected to db');
// Static files
app.use(express.static('public'));

firebase.initializeApp({
  serviceAccount: "./server/firebase-service-account.json",
  databaseURL:"https://firenode-155ef.firebaseio.com/"
});//end firebase.initializeApp

app.use(bodyParser.json());


// var underwriter = require ('../routers/underwriter');
// app.use('/underwriter', underwriter);
// // require and use auth router
// var auth = require('../routers/auth');
// app.use('/auth', auth);
//
// // require other server-side routers
// var admin = require ('../routers/admin');
// app.use('/admin', admin);
//
// var traffic = require ('../routers/traffic');
// app.use('/traffic', traffic);

// var production = require ('../routers/production');
// app.use('/production78', production);

app.post ('/production76', function (req, res){
	console.log ('req.body for client is', req.body);
	var client = req.body;
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('connection error in client', client);
		} else {
			var queryResults = client.query ('INSERT INTO production (contract_id, talent, who, what, site, why, cart_number, producer, complete_date) '+
																				'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)' ,
																			[req.body.contract_id, req.body.talent, req.body.who, req.body.what, req.body.site, req.body.why, req.body.cart_number, req.body.producer, req.body.complete_date]);
		}
		queryResults.on('end', function(){
			done();
			res.send({success: true});
		});//end queryResults for client table
	});//end pg.connect for client table
});//end router.post for client table

//generate a report from by getting info from db
app.get('/reports', function (req, res){
	console.log('in get reports');
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in reports');
		} else {
			var results = [];
			var queryResults = client.query('SELECT flight.cart_number, flight.start_date, flight.end_date, clients.name, users.name, master.total_cost') +
																		 ('FROM flight INNER JOIN clients ON clients.client_id = flight.id INNER JOIN users ON users.id = flight.id INNER JOIN master ON master.id = flight.id');
          queryResults.on('row', function(row){
            results.push(row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						invoiceMail();
						done();
						return res.json(results);
						console.log('results are', results);
					});//end queryResults on 'end'
		}
	});//end pg.connect for getting reports
});//end router.get for getting reports

// console.log('in traffic router');
//router.post slots
app.post ('/slots', function (req, res){
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

app.post ('/flight', function (req, res){
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
app.get('/trafficinfo', function (req, res){
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

app.get('/clientinfo', function (req, res){
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
app.get('/getslots', function (req, res){
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

app.get('/getflight', function (req, res){
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


app.post ('/client', function (req, res){
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

app.post ('/master', function (req, res){
	console.log('req.body is', req.body);
	var master = req.body;
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('connection error in master', err);
		} else {
			var queryResults = client.query ('INSERT INTO master (users_id, client_id, sign_date, event_name, spot_number, total_cost) ' +
																				('interviews, socialmedia, instructions, man_app, uw_app, pr_app, tr_app, spot_type, ' +
																				('spot_length, spot_rate, total_spots, flight_id, prod_id, copy_id, discounts, commission ' +
																				('VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)' ,
																			  [master]))));
		}
		queryResults.on('end', function(){
			sendMail();
			done();
			res.send({success: true});
		});//end queryResults
	});//end pg.connect
});//end router.post for master table

//get underwriter info from db for underwriter
app.get('/underwriterinfo', function (req, res){
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


var nodemailer = require ('../routers/nodemailer');
app.use('/nodemailer', nodemailer);


//port 5000 being used
var portDecision = process.env.PORT || 5000;

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});

// setting catch all route
app.get('/*', function(req,res){
  console.log('Made it to the catch all route, with',req.params);
  var file = req.params[0];

  // checking for valid url
  if (!file.includes('.')){
    file = 'views/index.html';
    // leave params untouched so that NG-routing can still use it
  }

  res.sendFile(path.resolve('public/', file));
});

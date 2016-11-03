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

// require server-side routers
var auth = require('../routers/auth');
app.use('/auth', auth);

var admin = require ('../routers/admin');
app.use('/admin', admin);

var underwriter = require ('../routers/underwriter');
app.use('/underwriter', underwriter);

var traffic = require ('../routers/traffic');
app.use('/traffic', traffic);

var production = require ('../routers/production');
app.use('/production', production);


var reports = require ('../routers/reports');
app.use('/reports', reports);

var nodemailer = require ('../routers/nodemailer');
app.use('/nodemailer', nodemailer);


//port 5000 being used
var portDecision = process.env.PORT || 6060;

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});

/////////////////////////////// client router ////////////////////////////////
//router.post client
app.post('/client', function (req, res){
  console.log ('a wrecked body', req.body);
	pg.connect(connectionString, function (err, client, done){
		if (err){
			console.log('connection error in client', client);
		} else {
			var queryResults = client.query('INSERT INTO clients (name, contact, address, city, state, zip, phone, cell, fax, email, webiste, users_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [req.body.client_name, req.body.contact, req.body.street, req.body.city, req.body.state, req.body.zip, req.body.phone, req.body.cell, req.body.fax, req.body.email, req.body.website, req.body.users_id]);
		}
		queryResults.on('end', function(){
			done();
			res.send({success: true});
		});//end queryResults for client table
	});//end pg.connect for client table
});//end router.post for client table

//////////// retrieve all client information ///////////////
// ('SELECT * FROM clients WHERE name=($1)', [req.query.name]);
app.get('/clients', function (req, res){
	console.log('get clients server route hit');
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
            // console.log('results are', results);
						return res.json(results);
					});//end queryResults on 'end'
  } // end first else
	});//end pg.connect for traffic info
});//end router.get for traffic info

app.get('/client', function (req, res){
	console.log('get client server route hit');
  console.log(req.query.q);
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in clientinfo');
		} else {
			var results = [];
			var queryResults = client.query('SELECT * FROM clients WHERE name=($1)', [req.query.q]);
					queryResults.on('row', function(row){
						results.push(row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						done();
            console.log('results are', results);
						return res.json(results);
					});//end queryResults on 'end'
  } // end first else
	});//end pg.connect for traffic info
});//end router.get for traffic info

app.put('/client', function (req, res){
	console.log('get client server route hit');
  console.log('req.query.q', req.query.q);
  console.log('req.body = ', req.body);
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in clientinfo');
		} else {
			var results = [];
			var queryResults = client.query('UPDATE clients SET name=($1), contact=($2), address=($3), city=($4), state=($5), zip=($6), phone=($7), cell=($8), fax=($9), email=($10), webiste=($11) WHERE name=($12)', [req.body.name, req.body.contact, req.body.address, req.body.city, req.body.state, req.body.zip, req.body.phone, req.body.cell, req.body.fax, req.body.email, req.body.webiste, req.query.q]);
					queryResults.on('row', function(row){
						results.push(row);
            console.log('row', row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						done();
            console.log('results are', results);
						return res.json(results);
					});//end queryResults on 'end'
  } // end first else
	});//end pg.connect for traffic info
});//end router.get for traffic info


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

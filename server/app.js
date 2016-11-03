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

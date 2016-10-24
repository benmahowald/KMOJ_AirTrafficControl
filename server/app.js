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


var underwrite = require ('../routers/underwrite');
app.use('/underwrite', underwrite);
// require and use auth router
var auth = require('../routers/auth');
app.use('/auth', auth);

// require other server-side routers
var admin = require ('../routers/admin');
app.use('/admin', admin);



var traffic = require ('../routers/traffic');
app.use('/traffic', traffic);

var production = require ('../routers/production');
app.use('/production', production);

//port 5000 being used
var portDecision = process.env.PORT || 5000;

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});

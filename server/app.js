var firebase = require('firebase');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// Static files
app.use(express.static('public'));

firebase.initializeApp({
  serviceAccount: "./server/firebase-service-account.json",
  databaseURL:"https://firenode-155ef.firebaseio.com/"
});//end firebase.initializeApp

app.use(bodyParser.json());

// require and use auth router
var auth = require('../routers/auth');
app.use('/auth', auth);

var portDecision = process.env.PORT || 5000;

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});

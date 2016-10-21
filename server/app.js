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

//Login
app.get("/adminLogin", function(req, res){
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    //logged in user information
    console.log(decodedToken);
    //select * from permissions where email=...
    res.send("You are logged in " + decodedToken.name);
  })//end verifyIdToken success
  .catch(function(error) {
    console.log("Login error:",error);
    res.send("Please Login");
  });//end id_token error
});//end adminLogin

var portDecision = process.env.PORT || 5000;

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});

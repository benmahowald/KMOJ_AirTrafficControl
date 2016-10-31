var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = 'postgres://localhost:5432/kmoj';

//Login
router.get("/adminLogin", function(req, res){
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



module.exports = router;

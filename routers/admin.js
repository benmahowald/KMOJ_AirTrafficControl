var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/kmoj';

<<<<<<< HEAD
router.post("/createNewUser", function(req, res){
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    console.log(decodedToken);
    if(decodedToken.email == "test@test.com"){
      console.log("Congrats " + decodedToken.email + "! You added " + req.body.email );
      pg.connect(connectionString, function (err, client, done){
        if (err){
          console.log('error', error);
        } else {
          var queryResults = client.query ('INSERT INTO users (email, permission, name, active) VALUES ($1, $2, $3, $4)', [req.body.email,req.body.permission,req.body.name,req.body.active]
      );
        }
        queryResults.on('end', function(){
          done();
          res.send({success: true});
        });//end queryResults
      });//end pg.connect
    } //end if
    else {
      res.send("You are not authorized to create a new user");
    }//end else
  }).catch(function(error) {
    console.log(error);
    res.send("Error",error);
  });//end error
});//end createNewUser

module.exports = router;

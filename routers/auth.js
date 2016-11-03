var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/kmoj';
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var user = [];

//Login
router.get("/Login", function(req, res){
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    //logged in user information
    console.log("decodedToken in DB:",decodedToken);
    pg.connect( connectionString, function( err, client, done ){
      //if err
      if( err ){
        console.log( 'error: ',err );
      } //end if error connecting
      else{
        console.log( 'connected to database' );
        //clear user array
        user = [];
        // query call to database table
        var queryResults = client.query( 'SELECT * FROM users WHERE email=\'' + decodedToken.email + '\'');
        queryResults.on( 'row', function( row ){
          // runs for each row in the query result
          user.push( row );
        }); // end on row
        queryResults.on( 'end', function(){
          // we're done
          done();
          console.log('user: ',user);
          // return result as a json version of array
          return res.json( user );
        });//end on end
      } // end no error
    }); // end connect
    //
    // res.send("You are logged in " + decodedToken.email);
  })//end verifyIdToken success
  .catch(function(error) {
    console.log("Login error:",error);
    res.send("Please Login");
  });//end id_token error
});//end Login



module.exports = router;

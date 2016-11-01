var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/kmoj';

// array to hold all `users`
var user=[];

router.post("/createNewUser", function(req, res){
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    console.log(decodedToken);
    if(decodedToken.email == "test@test.com"){
      console.log("Congrats " + decodedToken.email + "! You added " + req.body.email );
      pg.connect(connectionString, function (err, client, done){
        if (err){
          console.log('error', error);
        }//end if error
        else {
          var queryResults = client.query ('INSERT INTO users (email, permission, name, active) VALUES ($1, $2, $3, $4)', [req.body.email,req.body.permission,req.body.name,req.body.active]
      );//end queryResults
    }//end else
        queryResults.on('end', function(){
          done();
          res.send({success: true});
        });//end queryResults
      });//end pg.connect
    } //end if admin check
    else {
      res.send("You are not authorized to create a new user");
    }//end else
  }).catch(function(error) {
    console.log(error);
    res.send("Error",error);
  });//end error
});//end createNewUser

//get list of users from server
router.get('/userList', function(req,res){
  console.log('in userList');
  //pg connect
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
      var queryResults = client.query( 'SELECT * FROM users ORDER BY active ASC' );
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
    }; // end no error
  }); // end connect
});//end userList

module.exports = router;

var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.post("/createNewUser", function(req, res){
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    console.log(decodedToken);
    if(decodedToken.email == "test@test.com"){
      res.send("Congrats " + decodedToken.email + "! You added " + req.body.email );
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

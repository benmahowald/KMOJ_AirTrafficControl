var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = 'postgres://localhost:5432/kmoj';

// console.log('in admin router');
router.post ('/newUser', function (req, res){
	console.log ('req.body is ', req.body);
	var newUser = req.body;
	pg.connect(connectionString, function (err, client, done){
		if (err){
			var queryResults = client.query('INSERT INTO users (email, permissions, name, active) VALUES ($1, $2, $3, $4)',
		[newUser]);
		}
		queryResults.on ('end', function(){
			done();
			res.send ({success: true});
		});
	});//end pg.connect for newUser
});//end router.post for newUser

module.exports = router;

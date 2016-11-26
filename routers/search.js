var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var connectionString = 'postgres://localhost:5432/kmoj';

router.get('/cart_number', function (req, res){
  console.log('hit get route search cart_number');
  console.log('query is:', req.query.q);
  pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in reports');
		} else {
			var results = [];
			var queryResults = client.query('SELECT flight.cart_number, flight.start_date, flight.end_date, clients.name AS clients_name, users.name AS uw_name, master.total_cost FROM flight JOIN master ON flight.contract_id = master.id JOIN clients ON master.client_id = clients.client_id JOIN users ON master.users_id = users.id');
          queryResults.on('row', function(row){
            results.push(row);
						// console.log ('this is the row', row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						done();
						// console.log('results are', results);
						res.send(results);
					});//end queryResults on 'end'
		} // end else
	});//end pg.connect for searching by cart number
}); // end get search cart_number

router.get('/client_name', function (req, res){
  console.log('hit get route search client_name');
  console.log('query is:', req.query.q);
  var cart_number = req.query.q;
  pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in reports');
		} else {
			var results = [];
			// var queryResults = client.query('SELECT flight.cart_number, flight.start_date, flight.end_date, clients.name AS clients_name, users.name AS uw_name, master.total_cost FROM flight JOIN master ON flight.contract_id = master.id JOIN clients ON master.client_id = clients.client_id JOIN users ON master.users_id = users.id');
        var queryResults = client.query('SELECT');
          queryResults.on('row', function(row){
            results.push(row);
						// console.log ('this is the row', row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						done();
						res.send(results);
					});//end queryResults on 'end'
		} // end else
	});//end pg.connect for searching by client name
}); // end get search cart_number

module.exports = router;

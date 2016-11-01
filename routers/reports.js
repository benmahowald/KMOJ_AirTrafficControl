var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = 'postgres://localhost:5432/kmoj';

//generate a report from by getting info from db
router.get('/reports', function (req, res){
	console.log('in get reports');
	pg.connect(connectionString, function(err, client, done){
		if (err){
			console.log('connection err in reports');
		} else {
			var results = [];
			var queryResults = client.query('SELECT flight.cart_number, flight.start_date, flight.end_date, clients.name, users.name, master.total_cost') +
																		 ('FROM flight INNER JOIN clients ON clients.client_id = flight.id INNER JOIN users ON users.id = flight.id INNER JOIN master ON master.id = flight.id');
          queryResults.on('row', function(row){
            results.push(row);
					});//end queryResults.on 'row'
					queryResults.on('end', function(){
						invoiceMail();
						done();
						return res.json(results);
						console.log('results are', results);
					});//end queryResults on 'end'
		}
	});//end pg.connect for getting reports
});//end router.get for getting reports

module.exports = router;

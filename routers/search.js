var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var connectionString = 'postgres://localhost:5432/kmoj';

router.get('/cart_number', function (req, res){
  console.log('hit get route search cart_number');
}); // end get search cart_number

module.exports = router;

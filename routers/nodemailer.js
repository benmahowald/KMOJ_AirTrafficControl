var express = require ('express');
var app = express();
var pg = require ('pg');
var router = express.Router();
var nodemailer = require ('nodemailer');





//This message will be sent to the General & Sales Managers @ KMOJ
var managerMail = function(){
	transporter.sendMail({
	from: 'kmojatc@gmail.com',
	to: 'kmojproject@gmail.com', ///////CHANGE THIS EMAIL TO GM EMAIL/////////////
	subject: 'New contract added to queue!',
	text: 'Please go to Air Traffic Controller to approve a new contract!'
}, function (err, res){
		if (err){
			console.log('error sending mail to traffic and production', err);
		} else {
			// console.log ('message sent', res.message);
		}
		transporter.close();
	});
	};



//This message will be sent to the underwriter of the contract and the bookkeeper at KMOJ
var invoiceMail = function(){
	transporter.sendMail({
	from: 'kmojatc@gmail.com',
	to: 'kmojproject@gmail.com', ///////Change this Email to Bookkeeper and Underwriter  (who did contract) and GM///////
	subject: 'Invoice Generated',
	text: 'Please review the run sheet/invoice and proceed with underwriter approval'
},
function (err, res){
	if (err){
		console.log('error sending mail to traffic and production', err);
	} else {
		// console.log ('message sent', res.message);
	}
	transporter.close();

});
};
module.exports = router;

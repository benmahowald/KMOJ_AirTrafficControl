// var express = require ('express');
// var app = express();
// var pg = require ('pg');
// var router = express.Router();
// var nodemailer = require ('nodemailer');
//
// //using superadmin gmail account with following credentials:
// //username: kmojatc  password: manager@kmoj
// //This is being used as a dummy account for presentation purposes
// //Future developer will need to use auth. service to encrypt this info.
//
// //username: kmojatc  password: thepeoplesstation
//
// var transporter = nodemailer.createTransport({
// 	service: 'Gmail',
// 	auth: {
// 		user: 'kmojatc@gmail.com',
// 		pass: 'manager@kmoj'
// 	}
// });
//
//
// //This message will be sent to the General & Sales Managers @ KMOJ
// var managerMail = transporter.sendMail({
// 	from: 'kmojatc@gmail.com',
// 	to: 'kmojproject@gmail.com',
// 	subject: 'New contract added to queue!',
// 	text: 'Please go to Air Traffic Controller to approve a new contract!'
// }, function (err, res){
// 	if (err){
// 		console.log('error sending mail', err);
// 	} else {
// 		console.log('message sent ', res.message);
// 	}
// 	transporter.close();
// });
//
//
// //This message will be sent to the production and traffic staff @ KMOJ
// var protraffMail = transporter.sendMail({
// 	from: 'kmojatc@gmail.com',
// 	to: 'kmojproject@gmail.com',
// 	subject: 'New contract generated!!!',
// 	text: 'Please complete production and traffic forms for new spot.'
// }, function (err, res){
// 	if (err){
// 		console.log('error sending mail to traffic and production', err);
// 	} else {
// 		console.log ('message sent', res.message);
// 	}
// 	transporter.close();
// });
//
// //This message will be sent to the underwriter of the contract and the bookkeeper at KMOJ
// var invoiceMail = transporter.sendMail({
// 	from: 'kmojatc@gmail.com',
// 	to: 'kmojproject@gmail.com',
// 	subject: 'Invoice Generated',
// 	text: 'Please review the run sheet/invoice and proceed with underwriter approval'
// },
// function (err, res){
// 	if (err){
// 		console.log('error sending mail to traffic and production', err);
// 	} else {
// 		console.log ('message sent', res.message);
// 	}
// 	transporter.close();
//
// });
//
// module.exports = router;

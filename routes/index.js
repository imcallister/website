var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");


/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { 
		title: "Liv's page.",
		route: 'index'
	});
});

router.get('/ipython', function(req, res) {
	res.render('trading', { 
		title: 'iPython projects',
		route: 'ipython'
	});
});






module.exports = router;

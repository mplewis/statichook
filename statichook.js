// local packages
var config = require('./config');
var response = require('./response');

// npm packages
var express = require('express');

// node packages
var util = require('util');

// set up Express
var app = express();

// hooks should post to this Express address
var postAddress = '/' + config.global.secretUrlSuffix;

// set up route
app.get(postAddress, function(req, res){
  res.send(response.speak);
});

// set up 403 for all non-hook addresses
app.use(function(req, res, next){
  res.status(403).type('txt').send(response.forbidden);
});

// start listening
app.listen(config.global.port);

// print friendly message
var hookAddress = (config.global.host + ':' +
                   config.global.port + '/' +
                   config.global.secretUrlSuffix);
console.log(util.format('Listening for hooks on %s', hookAddress));

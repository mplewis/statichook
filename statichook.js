// local packages
var config = require('./config');
var response = require('./response');
var hookHandler = require('./hookHandler');

// npm packages
var express = require('express');
var bodyParser = require('body-parser');
var JaySchema = require('jayschema');
var winston = require('winston');

// node packages
var util = require('util');

// set up logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  colorize: true,
  level: 'debug',
  timestamp: true
});

// set up webhook data validator
var js = new JaySchema();
var schema = {
  bitbucket: require('./schemas/bitbucket.json')
};

// set up Express
var app = express();
app.use(bodyParser());

// hooks should post to this Express address
var postAddress = '/' + config.global.secretUrlSuffix;

// set up speak route
app.get(postAddress, function(req, res){
  res.send(response.speak);
});

// set up webhook route
app.post(postAddress, function(req, res){
  var posted = req.body;
  var errors = js.validate(posted, schema.bitbucket);
  if (errors.length > 0) {
    res.send(400, errors);
  } else {
    res.send(204);
    hookHandler.handle(posted);
  }
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
winston.log('info', util.format('Listening for hooks on %s', hookAddress));

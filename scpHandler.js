// npm packages
var winston = require('winston');
var SCP = require('./vendor/scp2');

// node packages
var util = require('util');
var fs = require('fs');
var path = require('path');

function NoAuthException(projNick) {
  this.value = projNick;
  this.message = 'does not have a privateKey or password for scp authentication';
  this.toString = function() {
    return this.value + ' ' + this.message;
  };
}

function scpWithKeyPath(srcPath, destPath, host, username, keyPath, callback) {
  fs.readFile(keyPath, function(err, keyData) {
    scpOptions = {
      host: host,
      username: username,
      privateKey: keyData,
      path: destPath
    };
    SCP.scp(srcPath, scpOptions, function(err) { callback(err); });
  });
}

function scpWithPassword(srcPath, destPath, host, username, password, callback) {
  scpOptions = {
    host: host,
    username: username,
    password: password,
    path: destPath
  };
  SCP.scp(srcPath, scpOptions, function(err) { callback(err); });
}

function scpToProject(project, srcPath, callback) {
  var projNick = util.format('%s/%s', project.repo.owner, project.repo.slug);
  winston.log('info', 'Starting scp for', projNick);
  var d = project.dest;
  var keyPath = d.privateKey;
  var password = d.password;
  winston.log('debug', 'private key present:', !(!(keyPath)));
  winston.log('debug', 'password present:', !(!(password)));
  
  if (keyPath && password) {
    winston.log('warn', util.format('Both private key and password provided for %s; ' +
                                    'using private key for authentication', projNick));
    scpWithKeyPath(srcPath, d.path, d.host, d.username, keyPath, callback);
  
  } else if (keyPath) {
    winston.log('debug', util.format('Using private key for authentication to %s', projNick));
    scpWithKeyPath(srcPath, d.path, d.host, d.username, keyPath, callback);
  
  } else if (password) {
    winston.log('debug', util.format('Using password for authentication to %s', projNick));
    scpWithPassword(srcPath, d.path, d.host, d.username, password, callback);
  
  } else {
    callback(new NoAuthException(projNick));
  }
}

module.exports = {
  scpToProject: scpToProject,
  NoAuthException: NoAuthException
};

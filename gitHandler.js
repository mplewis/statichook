var fs = require('fs');

var gitane = require('gitane');

function cloneInto(repoUrl, destPath, keyPath, callback) {
  console.log(gitCmd);
  
  var gitClone = function(keyData) {
    // clone with . to avoid the extra containing folder
    var gitCmd = 'git clone ' + repoUrl + ' .';
    gitane.run(destPath, keyData, gitCmd, function(err, stdout, stderr, exitCode) {
      callback(err, stdout, stderr, exitCode);
    });
  };
  
  // If there's a key, clone with the key; otherwise, clone with no key
  if (keyPath) {
    fs.readFile(keyPath, function(err, keyData) {
      if (err) { callback(err); return; }
      gitClone(keyData);
    });
  } else {
    gitClone(null);
  }
}

module.exports = {
  cloneInto: cloneInto
};

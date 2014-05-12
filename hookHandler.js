var config = require('./config');
var gitHandler = require('./gitHandler');
var scpHandler = require('./scpHandler');

var tmp = require('tmp');
var winston = require('winston');

var util = require('util');

/* Check if posted hook data has a commit to Master AND corresponds to a
 * project in the config file.
 * If both are true, run that project's SCP job.
 *
 * Assumes hookData is sanitized and in Bitbucket webhook format.
 */
function handle(hookData) {
  var owner = hookData.repository.owner;
  var slug = hookData.repository.slug;
  var project = getProject(owner, slug);
  winston.log('info', util.format('Received hook for %s/%s', owner, slug));
  
  if (!project) {
    winston.log('info', util.format('No project found for %s/%s, ignoring', owner, slug));
    return;
  }
  winston.log('debug', 'Project info:');
  winston.log('debug', util.inspect(project));

  winston.log('debug', 'Hook commit info:');
  winston.log('debug', util.inspect(hookData.commits));
  if (!hasMasterCommit(hookData.commits)) {
    winston.log('info', util.format('No master commits found for %s/%s, ignoring', owner, slug));
    return;
  }

  winston.log('info', util.format('Running project for %s/%s', owner, slug));

  tmp.dir(function(err, destPath) {
    if (err) throw err;
    winston.log('info', 'Temp dir created:', destPath);
    var repoUrl = project.repo.url;
    var keyPath = project.repo.sshPrivKeyPath;
    gitHandler.cloneInto(repoUrl, destPath, keyPath,
        function(err, stdout, stderr, exitCode) {
      if (err) {
        winston.log('error', 'Git clone failed');
        winston.log('error', 'STDOUT:');
        winston.log('error', stdout);
        winston.log('error', 'STDERR:');
        winston.log('error', stderr);
        winston.log('error', 'EXIT CODE: ' + exitCode);
        throw err;
      }
      winston.log('info', util.format('Git clone complete for %s/%s', owner, slug));
    });
  });
}

/* Returns true if at least one commit in the commits array is to the master
 * branch. Returns false otherwise.
 */
function hasMasterCommit(commits) {
  for (var i = 0; i < commits.length; i++) {
    var commit = commits[i];
    if (commit.branch === 'master') {
      return true;
    }
  }
  return false;
}

/* Check if there's a project for the provided owner and slug.
 * If there is, return the project data.
 * If there isn't, return null.
 */
function getProject(owner, slug) {
  for (var i = 0; i < config.projects.length; i++) {
    var project = config.projects[i];
    if (project.repo.owner === owner && project.repo.slug === slug) {
      return project;
    }
  }
  return null;
}

module.exports = {
  handle: handle
};

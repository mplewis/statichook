// local packages
var config = require('./config');
var gitHandler = require('./gitHandler');
var scpHandler = require('./scpHandler');

// npm packages
var tmp = require('tmp');
var winston = require('winston');
var rimraf = require('rimraf');

// node packages
var util = require('util');
var fs = require('fs');
var path = require('path');

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
  var projNick = util.format('%s/%s', owner, slug);
  winston.log('info', util.format('%s: Received hook', projNick));
  
  if (!project) {
    winston.log('info', util.format('%s: No project found', projNick));
    return;
  }
  winston.log('debug', 'Project repo info:');
  winston.log('debug', util.inspect(project.repo));

  winston.log('debug', 'Hook commit info:');
  winston.log('debug', util.inspect(hookData.commits));
  if (!hasMasterCommit(hookData.commits)) {
    winston.log('info', util.format('%s: No master commits found', projNick));
    return;
  }

  winston.log('info', util.format('%s: Running project', projNick));

  tmp.dir(function(err, tmpDir) {
    if (err) winston.log('error', err.toString());
    winston.log('info', util.format('%s: Temp dir created: %s', projNick, tmpDir));
    var repoUrl = project.repo.url;
    var keyPath = project.repo.privateKey;
    winston.log('info', util.format('%s: Cloning %s', projNick, repoUrl));
    gitHandler.cloneInto(repoUrl, tmpDir, keyPath,
        function(err, stdout, stderr, exitCode) {
      if (err) {
        winston.log('error', util.format('%s: Git clone failed', projNick));
        winston.log('error', 'STDOUT:');
        winston.log('error', stdout);
        winston.log('error', 'STDERR:');
        winston.log('error', stderr);
        winston.log('error', 'EXIT CODE: ' + exitCode);
        winston.log('error', err.toString());
      }
      winston.log('info', util.format('%s: Git clone complete', projNick));

      var repoPath = project.repo.path;
      var srcPath;
      if (repoPath) {
        srcPath = path.join(tmpDir, repoPath);
        winston.log('info', util.format('%s: Sending files from repo directory %s', projNick, repoPath));
      } else {
        winston.log('info', util.format('%s: Sending all files from repo', projNick));
      }
      winston.log('debug', util.format('%s: Full path to files being sent: %s', projNick, srcPath));

      scpHandler.scpToProject(project, srcPath, function(err) {
        if (err) {
          if (err instanceof scpHandler.NoAuthException) {
            winston.log('error', err.toString());
          } else {
            winston.log('error', util.format('%s: scp failed', projNick));
            winston.log('error', err.toString());
          }
        } else {
          winston.log('info', util.format('%s: scp complete', projNick));
        }
        rimraf(tmpDir, function(err) {
          if (err) {
            winston.log('error', util.format('%s: Temp dir not removed: %s', projNick, tmpDir));
            winston.log('error', err.toString());
          } else {
            winston.log('info', util.format('%s: Temp dir removed: %s', projNick, tmpDir));
          }
        });
      });
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

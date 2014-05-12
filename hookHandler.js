var config = require('./config');
var gitHandler = require('./gitHandler');
var scpHandler = require('./scpHandler');

var tmp = require('tmp');

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
  if (!project) {
    return;
  }
  console.log(project);
  if (!hasMasterCommit(hookData.commits)) {
    return;
  }
  console.log(owner, slug);

  tmp.dir(function(err, destPath) {
    if (err) throw err;
    console.log("Dir: ", destPath);
    var repoUrl = project.repo.url;
    var keyPath = project.repo.sshPrivKeyPath;
    gitHandler.cloneInto(repoUrl, destPath, keyPath,
        function(err, stdout, stderr, exitCode) {
      if (err) {
        console.log('STDOUT:');
        console.log(stdout);
        console.log('STDERR:');
        console.log(stderr);
        console.log('Exit code ' + exitCode);
        throw err;
      }
      console.log('Git clone complete.');
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

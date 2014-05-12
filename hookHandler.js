var config = require('./config');
var scpHandler = require('./scpHandler');

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
  if (!hasMasterCommit(hookData.commits)) {
    return;
  }
  console.log(owner, slug);
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

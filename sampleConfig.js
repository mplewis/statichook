var global = {
  host: 'http://subdomain.yourdomain.com',
  port: 8461,
  secretUrlSuffix: 'putSomeAlphanumericSecretCharsHere'
};

var projects = [
  {
    repo: {
      owner: 'yourbitbucketusername',
      slug: 'your-bitbucket-source-repo-name',
      sshPrivKeyPath: '/home/youruser/.ssh/id_rsa'
    },
    dest: {
      host: 'yourstaticwebhost.com',
      username: 'yourusername',
      password: 'yourpassword',
      path: '/home/youruser/html_dest/'
    }
  }
];

module.exports = {
  global: global,
  projects: projects
};

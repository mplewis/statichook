var global = {
  domain: 'http://subdomain.yourdomain.com/',
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

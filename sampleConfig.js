var global = {
  domain: 'http://subdomain.yourdomain.com/',
  secretUrlSuffix: 'putSomeAlphanumericSecretCharsHere'
};

var projects = [
  {
    repo: {
      owner: 'yourbitbucketusername',
      slug: 'your-bitbucket-repo-name',
      sshPrivKeyPath: '/home/youruser/.ssh/id_rsa'
    },
    dest: {
      host: 'yourstaticwebhost.com',
      username: 'yourusername',
      password: 'yourpassword',
      path: '/home/youruser/public_html/'
    }
  }
];

module.exports = {
  global: global,
  projects: projects
};

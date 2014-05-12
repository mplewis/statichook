var global = {
  host: 'http://subdomain.yourdomain.com',
  port: 8461,
  secretUrlSuffix: 'putSomeAlphanumericSecretCharsHere'
};

var projects = [
  {
    repo: {
      owner: 'yourbitbucketusername',
      slug: 'your-bitbucket-private-repo-name',
      url: 'git@bitbucket.org:yourbitbucketusername/your-bitbucket-private-repo-name.git',
      privateKey: '/home/youruser/.ssh/id_rsa'
    },
    dest: {
      host: 'yourstaticwebhost.com',
      username: 'yourusername',
      password: 'yourpassword',
      path: '/home/youruser/html_dest/'
    }
  },
  {
    repo: {
      owner: 'yourbitbucketusername',
      slug: 'your-bitbucket-public-repo-name',
      url: 'git@bitbucket.org:yourbitbucketusername/your-bitbucket-public-repo-name.git',
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

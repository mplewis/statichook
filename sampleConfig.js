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
      path: '/home/youruser/some_other/directory/that_may/not_exist_yet/'
    }
  },
  {
    repo: {
      owner: 'yourbitbucketusername',
      slug: 'your-bitbucket-repo-with-subdir',
      url: 'git@bitbucket.org:yourbitbucketusername/your-bitbucket-repo-with-subdir.git',
      path: '/your-repo-subdir'
    },
    dest: {
      host: 'yourstaticwebhost.com',
      username: 'yourusername',
      privateKey: '/home/youruser/.ssh/another_id_rsa',
      path: '/home/youruser/another_dest/'
    }
  }
];

var winstonOptions = {
  colorize: true,
  level: 'info',
  timestamp: true
};

module.exports = {
  global: global,
  projects: projects,
  winstonOptions: winstonOptions
};

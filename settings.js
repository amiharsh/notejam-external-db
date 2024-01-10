var settings = {
  development: {
    db: {
      host: 'mysql',
      user: 'notejam',
      password: 'notejam123',
      database: 'notejam',
      connectionLimit: 10 // Adjust as needed
    },
    dsn: 'mysql://notejam:notejam123@mysql/notejam'
  },
  test: {
    db: {
      host: 'mysql',
      user: 'notejam',
      password: 'notejam123',
      database: 'notejam',
      connectionLimit: 10 // Adjust as needed
    },
    dsn: 'mysql://notejam:notejam123@mysql/notejam'
  }
};

var env = process.env.NODE_ENV || 'development';

module.exports = settings[env];

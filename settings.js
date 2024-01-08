var settings = {
  development: {
    db: {
      host: 'localhost',
      user: 'notejam',
      password: 'notejam123',
      database: 'notejam',
      connectionLimit: 10 // Adjust as needed
    },
    dsn: 'mysql://notejam:notejam123@localhost/notejam'
  },
  test: {
    db: {
      host: 'localhost',
      user: 'notejam',
      password: 'notejam123',
      database: 'notejam',
      connectionLimit: 10 // Adjust as needed
    },
    dsn: 'mysql://notejam:notejam123@localhost/notejam'
  }
};

var env = process.env.NODE_ENV || 'development';

module.exports = settings[env];

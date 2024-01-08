var mysql = require('mysql2');
var async = require('async');

var settings = require('./settings');
var db = mysql.createConnection(settings.db); // You need to provide your MySQL connection details in settings.mysqlConfig

var functions = {
  createTables: function(next) {
    async.series({
      createUsers: function(callback) {
        db.query("CREATE TABLE IF NOT EXISTS users (" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "email VARCHAR(75) NOT NULL," +
            "password VARCHAR(128) NOT NULL);", [],
            function(err) { callback(err); });
      },
      createPads: function(callback) {
        db.query("CREATE TABLE IF NOT EXISTS pads (" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(100) NOT NULL," +
            "user_id INT NOT NULL," +
            "FOREIGN KEY (user_id) REFERENCES users(id));", [],
            function(err) { callback(err); });
      },
      createNotes: function(callback) {
        db.query("CREATE TABLE IF NOT EXISTS notes (" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "pad_id INT," +
            "user_id INT NOT NULL," +
            "name VARCHAR(100) NOT NULL," +
            "text TEXT NOT NULL," +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
            "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
            "FOREIGN KEY (pad_id) REFERENCES pads(id)," +
            "FOREIGN KEY (user_id) REFERENCES users(id));", [],
            function(err) { callback(err); });
      }
    },
    function(err, results) {
      next(err);
    });
  },

  applyFixtures: function(next) {
    this.truncateTables(function() {
      async.series([
        function(callback) {
          db.query("INSERT INTO users (email, password) VALUES " +
            "('user1@example.com', '$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u')," +
            "('user2@example.com', '$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u');", [],
            function(err) { callback(err); });
        },
        function(callback) {
          db.query("INSERT INTO pads (name, user_id) VALUES " +
            "('Pad 1', 1)," +
            "('Pad 2', 1);", [],
            function(err) { callback(err); });
        },
        function(callback) {
          db.query("INSERT INTO notes (pad_id, user_id, name, text) VALUES " +
            "(1, 1, 'Note 1', 'Text')," +
            "(1, 1, 'Note 2', 'Text');", [],
            function(err) { callback(err); });
        }
      ], function(err, results) {
        next(err);
      });
    });
  },
  

  truncateTables: function(next) {
    async.series([
      function(callback) {
        db.query("DELETE FROM users;", [],
              function(err) { callback(err); });
      },
      function(callback) {
        db.query("DELETE FROM notes;", [],
              function(err) { callback(err); });
      },
      function(callback) {
        db.query("DELETE FROM pads;", [],
              function(err) { callback(err); });
      }
    ], function(err, results) {
      next(err);
    });
  }
}

if (require.main === module) {
  db.connect(function(err) {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    functions.createTables(function(err) {
      if (err) {
        console.error('Error creating tables:', err);
        return;
      }
      console.log("DB successfully initialized");
      db.end(); // Close the MySQL connection
    });
  });
}

module.exports = functions;

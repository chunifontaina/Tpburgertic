const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'burguertic'
};

const connection = mysql.createConnection(dbConfig);

module.exports = {
  connection, 
};

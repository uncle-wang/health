const mysql = require('mysql2');
const CONFIG = require('./config.json').MYSQL;

const pool = mysql.createPool({
  host: CONFIG.host,
  user: CONFIG.user,
  password: CONFIG.password,
  database: CONFIG.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;

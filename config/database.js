const mysql = require('mysql2/promise');


const DB = mysql.createPool({
    host: process.env.DATABASE_ID,
    user: process.env.DATABASE_USERNAME,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: '3306',
    waitForConnections: true,
    // connectionLimit: 10,
    // maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    // idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,

  });



DB.on('connection', function (connection) {
console.log('DB Connection established');

connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
});
connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
});

});
  

module.exports = DB
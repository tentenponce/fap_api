
'user strict';

const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'p@55w0rd',
    database : 'dtr_db'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
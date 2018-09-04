const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database:'testdb'
});

exports.getUsers = function(id,done) {
    let query = 'SELECT * FROM users WHERE 1=1 ';
    let filters = [];

    if (id) {
        query += ' AND ID = ?';
        filters.push(id);
    }

    connection.query(query, filters, (err, result) => {
        if (err) {
            throw err;
        }
        done(result);
    });
}

exports.insertUser = function(body,done) {
    let query = 'INSERT INTO users SET ? ';
    
    connection.query(query, body, (err, result) => {
        if (err) {
            throw err;
        }
        done(result);
    });
}

exports.updateUser = function(body,done) {
    let query = 'UPDATE users SET username = ? where id = ? ';
    let filters = [body.username, body.id];
    connection.query(query, filters, (err, result) => {
        if (err) {
            throw err;
        }
        done(result);
    });
}

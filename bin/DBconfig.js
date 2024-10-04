/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

const mysql = require('mysql');
const {promisify} = require('util');
const {DBconfig} = require('./DBKeys');


var pool = mysql.createPool(DBconfig);

pool.getConnection(function (err, connection) {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('DATABASE CONNECTION WAS CLOSE');
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('DATABASE HAS TO MANY CONNETIONS');
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('DATABASE CONNECTION WAS REFUSED')
            }
            return;
        }
        console.log('DATABASE IS CONNECTED');
        return;
    }
);

pool.query = promisify(pool.query);
module.exports = pool;

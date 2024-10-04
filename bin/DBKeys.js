/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

const CONFIG = require ('../config/config.js');
const DBconfig = {
    host: CONFIG.db_host,
    user: CONFIG.db_user,
    password: CONFIG.db_password,
    database: CONFIG.db_name,
    charset: CONFIG.db_charset
};
module.exports = {
    DBconfig
};

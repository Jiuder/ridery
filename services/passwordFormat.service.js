/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

async function newPassword(passwordUser) {
  return await bcrypt.hash(passwordUser, salt);
}

async function checkPassword(passwordUser, passwordDB) {
  return await bcrypt.compare(passwordUser, passwordDB);
}

module.exports = {
  newPassword,
  checkPassword
};

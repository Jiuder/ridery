/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

async function tokensCreated(id) {
  let tokenData = {
    userId: id
  };
  return jwt.sign(tokenData, CONFIG.jwt_encryption, {
    expiresIn: CONFIG.jwt_expiration
  });
}

module.exports = {
  tokensCreated
};

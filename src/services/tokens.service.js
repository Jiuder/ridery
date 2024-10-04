const jwt = require('jsonwebtoken');
const CONFIG = require('../../config/config');

async function tokensCreated(id) {
  const tokenData = {
    userId: id,
  };
  return jwt.sign(tokenData, CONFIG.jwt_encryption, {
    expiresIn: CONFIG.jwt_expiration,
  });
}

module.exports = {
  tokensCreated,
};

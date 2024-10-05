const jwt = require('jsonwebtoken');
const CONFIG = require('../../config/config');

async function tokensCreated(data) {
  const tokenData = {
    userId: data.id,
    role: data.role,
  };
  return jwt.sign(tokenData, CONFIG.jwtEncryption, {
    expiresIn: CONFIG.jwtExpiration,
  });
}

module.exports = {
  tokensCreated,
};

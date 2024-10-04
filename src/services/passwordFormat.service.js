const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

async function newPassword(passwordUser) {
  return await bcrypt.hash(passwordUser, salt);
}

async function checkPassword(passwordUser, passwordDB) {
  return bcrypt.compare(passwordUser, passwordDB);
}

module.exports = {
  newPassword,
  checkPassword,
};

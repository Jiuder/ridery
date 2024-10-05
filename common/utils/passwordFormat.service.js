const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

function newPassword(passwordUser) {
  return bcrypt.hash(passwordUser, salt);
}

function checkPassword(passwordUser, passwordDB) {
  return bcrypt.compare(passwordUser, passwordDB);
}

module.exports = {
  newPassword,
  checkPassword,
};

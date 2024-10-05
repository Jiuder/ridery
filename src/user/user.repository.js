const User = require('../../db/schema/user.schema');

const registerUserRepository = async (data) => {
  const saveUser = new User(data);
  return saveUser.save();
};

const findUser = async (filter) => {
  return User.findOne(filter);
};

module.exports = {
  registerUserRepository,
  findUser,
};

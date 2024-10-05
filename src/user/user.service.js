const {
  newPassword,
  checkPassword,
} = require('../../common/utils/passwordFormat.service');
const { tokensCreated } = require('../../common/utils/tokens.service');
const { registerUserRepository, findUser } = require('./user.repository');

const registerUserService = async (data) => {
  const { email, document } = data;

  const isExist = await findUser({
    $or: [{ email }, { document }],
  });

  if (isExist) {
    return { error: 'User already exists' };
  }

  data.password = await newPassword(data.password);
  return registerUserRepository(data).then((user) => {
    return { success: user.success };
  });
};

const loginUserService = async (data) => {
  const { email, password } = data;

  const isExist = await findUser({ email });

  if (!isExist) {
    return { error: 'User not exists' };
  }

  const validate = await checkPassword(password, isExist.password);

  if (!validate) {
    return { error: 'Password is incorrect' };
  }

  delete isExist.password;

  return tokensCreated(isExist);
};

module.exports = {
  registerUserService,
  loginUserService,
};

const { ReE, ReS } = require('../../common/utils/util.service');
const {
  joiValidation,
  usersSchema,
  loginSchema,
} = require('../../common/utils/joi.service');
const { registerUserService, loginUserService } = require('./user.service');

const registerUser = async (req, res) => {
  const result = joiValidation(req.body, usersSchema);
  if (result.error) {
    const err = result.error.details[0];
    return ReE(res, err, 400, result);
  }
  try {
    const response = await registerUserService(req.body);

    if (response.error) {
      return ReE(res, response.error, 400);
    }
    return ReS(res, response, 200);
  } catch (e) {
    return ReE(res, '500', 500, e);
  }
};

const login = async (req, res) => {
  const result = joiValidation(req.body, loginSchema);
  if (result.error) {
    const err = result.error.details[0];
    return ReE(res, err, 400, result);
  }
  try {
    const response = await loginUserService(req.body);

    return ReS(res, response, 200);
  } catch (e) {
    return ReE(res, '500', 500, e);
  }
};

module.exports = {
  registerUser,
  login,
};

const pool = require('../bin/DBconfig');

/**
 * @return {boolean}
 */
async function UserIdValidation(id) {
  let userValidation = await pool.query(`SELECT users.users_id,
                                            users.users_active
                                     FROM users
                                     WHERE users.users_id = ?
                                       AND users.users_active = true`, [id]);
  return userValidation.length > 0;
}

/**
 * @return {boolean}
 */
async function UserIdValidationTypeAdmin(id) {
  let userValidation = await pool.query(`SELECT users.users_id
                                         from users
                                                INNER JOIN userlevels
                                                           ON users.userLevelsId = userlevels.userLevelsId
                                         WHERE users.users_id = ?
                                           AND userlevels.userLevelsId = 1 AND users.enabled = 1`, [id]);

  return userValidation.length > 0;
}

/**
 * @return {boolean}
 */
async function UserIdValidationTypeAdminOrSocialMedia(id) {
  let userValidation = await pool.query(`SELECT users.users_id
                                         from users
                                                INNER JOIN userlevels
                                                           ON users.userLevelsId = userlevels.userLevelsId
                                         WHERE users.users_id = ?  AND users.enabled = 1 
                                           AND userlevels.userLevelsId = 1 or  userlevels.userLevelsId = 1  AND users.enabled = 1`, [id]);

  return userValidation.length > 0;
}

/**
 * @return {boolean}
 */
async function UserIdValidationTypeAdminShop(id) {
  let userValidation = await pool.query(`SELECT users.users_id
                                         from users
                                                INNER JOIN userlevels
                                                           ON users.userLevelsId = userlevels.userLevelsId
                                         WHERE users.users_id = ?
                                           AND userlevels.userLevelsId = 4 AND users.enabled = 1`, [id]);

  return userValidation.length > 0;
}

/**
 * @return {boolean}
 */
async function UserIdValidationTypeALLAdmin(id) {
  let userValidation = await pool.query(`SELECT users.usersId
                                         from users
                                                INNER JOIN userlevels
                                                  ON users.userLevelsId = userlevels.userLevelsId
                                         WHERE users.usersId = ?
                                           AND userlevels.userLevelsId = 4
                                          OR users.usersId = ? AND userlevels.userLevelsId = 1 AND users.enabled = 1`, [id, id]);

  return userValidation.length > 0;
}

async function PasswordValidations(id) {
  let userValidation = await pool.query(`SELECT users.usersId
                                         from users
                                         WHERE users.usersId = ? AND users.enabled = 1`, [id]);

  return userValidation.length > 0;
}

/**
 * @return {boolean}
 */
async function UserIdValidationTypeDelivery(id) {
  let userValidation = await pool.query(`SELECT users.usersId
                                         from users
                                                INNER JOIN userlevels
                                                           ON users.userLevelsId = userlevels.userLevelsId
                                         WHERE users.usersId = ?
                                           AND userlevels.userLevelsId = 2 AND users.enabled = 1`, [id]);

  return userValidation.length > 0;
}

module.exports = {
  UserIdValidation,
  UserIdValidationTypeAdmin,
  UserIdValidationTypeAdminShop,
  UserIdValidationTypeALLAdmin,
  UserIdValidationTypeDelivery,
  PasswordValidations,
  UserIdValidationTypeAdminOrSocialMedia
};

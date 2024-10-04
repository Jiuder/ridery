/*
 *
 *  * Copyright (c) 2019.
 *  * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 *
 */
const passport = require('passport');
const {messagesMap} = require("../helpers/messages.helper");
require('./passport')(passport);
const {messages} = require('../helpers/messages.helper');
const {UserIdValidation, UserIdValidationTypeAdmin, UserIdValidationTypeAdminShop, UserIdValidationTypeALLAdmin, UserIdValidationTypeDelivery, PasswordValidations} = require('../helpers/validations.helper');
const {to} = require('../services/util.service');
const {UserIdValidationTypeAdminOrSocialMedia} = require("../helpers/validations.helper");

function passport_tryauthenticate(callback) {
  function hack(req, res, next) {
    passport.authenticate('jwt', {session: false}, async function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        req.user = user;
        return callback(req, res, next)
      } else {
        if (await UserIdValidation(user.userId)) {
          req.user = user;
          //
          return callback(req, res, next);
        } else {
          res.statusCode = 401;
          return res.json({success: false, message: messagesMap["401"]['3']});
        }
      }
    })(req, res, next);
  }

  return hack
}

function passport_authenticate_jwt(callback) {
  function hack(req, res, next) {
    passport.authenticate('jwt', {session: false}, async function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        res.statusCode = 401;
        return res.json({success: false, message: messagesMap["usersNotLogin"]});
      } else {
        if (await UserIdValidation(user.userId)) {
          req.user = user;
          // await auditar

          console.log(user)
          return callback(req, res, next);
        } else {
          res.statusCode = 401;
          return res.json({success: false, message: messagesMap["usersNotLogin"]});
        }
      }
    })(req, res, next);
  }

  return hack
}

function passport_AllUsers(callback) {
  function hack(req, res, next) {
    passport.authenticate('jwt', {session: false}, async function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        res.statusCode = 401;
        return res.json({success: false, message: messagesMap["401"]['1']});
      } else {
        req.user = user;
        //
        return callback(req, res, next);
      }
    })(req, res, next);
  }

  return hack
}

function passport_Passwordauthenticate_jwt(callback) {
  function hack(req, res, next) {
    passport.authenticate('jwt', {session: false}, async function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        res.statusCode = 401;
        return res.json({success: false, message: messagesMap["401"]['1']});
      } else {
        if (await PasswordValidations(user.userId)) {
          req.user = user;
          //
          return callback(req, res, next);
        } else {
          res.statusCode = 401;
          return res.json({success: false, message: messagesMap["401"]['3']});
        }
      }
    })(req, res, next);
  }

  return hack
}

function passport_authenticate_jwtTipoDelivery(callback) {
  function hack(req, res, next) {
    passport.authenticate('jwt', {session: false}, async function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        res.statusCode = 401;
        return res.json({success: false, message: messagesMap["401"]['1']});
      }
      if (await UserIdValidationTypeDelivery(user.userId)) {
        req.user = user;
        //
        return callback(req, res, next);
      } else {
        res.statusCode = 400;
        return res.json({success: false, message: messagesMap["401"]['4']});
      }
    })(req, res, next);
  }

  return hack
}

function passport_authenticate_jwtTipoAdmins(callback) {
  function hack(req, res, next) {
    passport.authenticate('jwt', {session: false}, async function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        res.statusCode = 401;
        return res.json({success: false, message: messagesMap["401"]['1']});
      } else {
        if (await UserIdValidationTypeAdmin(user.userId)) {
          req.user = user;

          return callback(req, res, next);
        } else {
          res.statusCode = 400;
          return res.json({success: false, message: messagesMap["401"]['4']});
        }
      }
    })(req, res, next);
  }

  return hack
}

function passport_authenticate_jwtTipoAdminsOrSocialMedia(callback) {
  function hack(req, res, next) {
    passport.authenticate('jwt', {session: false}, async function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        res.statusCode = 401;
        return res.json({success: false, message: messagesMap["401"]['1']});
      } else {
        if (await UserIdValidationTypeAdminOrSocialMedia(user.userId)) {
          req.user = user;
          //
          return callback(req, res, next);
        } else {
          res.statusCode = 400;
          return res.json({success: false, message: messagesMap["401"]['4']});
        }
      }
    })(req, res, next);
  }

  return hack
}

function passport_authenticate_jwtTipoAdminShops(callback) {
  function hack(req, res, next) {
    passport.authenticate('jwt', {session: false}, async function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        res.statusCode = 401;
        return res.json({success: false, message: messagesMap["401"]['1']});
      } else {
        if (await UserIdValidationTypeAdminShop(user.userId)) {
          req.user = user;

          return callback(req, res, next);
        } else {
          res.statusCode = 400;
          return res.json({success: false, message: messagesMap["401"]['4']});
        }
      }
    })(req, res, next);
  }

  return hack
}

function passport_authenticate_jwtTipoALLAdmin(callback) {
  function hack(req, res, next) {
    passport.authenticate('jwt', {session: false}, async function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        res.statusCode = 401;
        return res.json({success: false, message: messagesMap["401"]['1']});
      } else {
        if (await UserIdValidationTypeALLAdmin(user.userId)) {
          req.user = user;

          return callback(req, res, next);
        } else {
          res.statusCode = 400;
          return res.json({success: false, message: messagesMap["401"]['4']});
        }
      }
    })(req, res, next);
  }

  return hack
}


module.exports = {
  passport_tryauthenticate,
  passport_authenticate_jwt,
  passport_authenticate_jwtTipoDelivery,
  passport_authenticate_jwtTipoAdmins,
  passport_authenticate_jwtTipoAdminShops,
  passport_Passwordauthenticate_jwt,
  passport_AllUsers,
  passport_authenticate_jwtTipoALLAdmin,
  passport_authenticate_jwtTipoAdminsOrSocialMedia
};

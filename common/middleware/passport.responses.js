const passport = require('passport');
require('./passport')(passport);

module.exports = function authenticate(callback) {
  function hack(req, res, next) {
    passport.authenticate(
      'jwt',
      { session: false },
      async function (err, user) {
        if (err) return next(err);
        if (!user) {
          res.statusCode = 403;
          return res.json({ success: false, message: 'Not authorized' });
        } else {
          req.user = user;
          return callback(req, res, next);
        }
      },
    )(req, res, next);
  }

  return hack;
};

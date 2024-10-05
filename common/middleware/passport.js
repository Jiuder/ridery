const { ExtractJwt, Strategy } = require('passport-jwt');
const CONFIG = require('../../config/config');
const { to } = require('../utils/util.service');

module.exports = function (passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = CONFIG.jwtEncryption;
  passport.use(
    new Strategy(opts, async function (jwt, done) {
      let err, user;
      if (typeof jwt.then === 'function') {
        [err, user] = await to(jwt.userId);
        if (err) return done(err, false);
        if (user) {
          return done(null, user);
        }
      } else if (typeof jwt.then !== 'function') {
        return done(null, jwt);
      } else {
        return done(null, false);
      }
    }),
  );
};

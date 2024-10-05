const authenticate = require('../common/middleware/passport.responses');
const { registerUser, login } = require('../src/user/user.controller');
const router = require('./index');

router.post(
  '/register',
  authenticate((req, res, next) => {
    return registerUser(req, res);
  }),
);
router.post('/login', login);

module.exports = router;

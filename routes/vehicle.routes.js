const authenticate = require('../common/middleware/passport.responses');
const {
  registerVehicleType,
  registerVehicle,
  getAllVehicles,
} = require('../src/vehicle/vehicle.controller');
const router = require('./index');

router.post(
  '/vehicle-type',
  authenticate((req, res, next) => {
    return registerVehicleType(req, res);
  }),
);
router.post(
  '',
  authenticate((req, res, next) => {
    return registerVehicle(req, res);
  }),
);
router.get(
  '/',
  authenticate((req, res, next) => {
    return getAllVehicles(req, res);
  }),
);
router.get(
  '/:typeId',
  authenticate((req, res, next) => {
    return getAllVehicles(req, res);
  }),
);

module.exports = router;

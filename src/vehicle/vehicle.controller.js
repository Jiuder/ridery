const {
  joiValidation,
  vehicleTypeSchema,
  vehicleSchema,
} = require('../../common/utils/joi.service');
const { ReE, ReS } = require('../../common/utils/util.service');
const {
  registerVehicleTypeService,
  registerVehicleService,
  fillAllVehicles,
} = require('./vehicle.service');

const registerVehicleType = async (req, res) => {
  const result = joiValidation(req.body, vehicleTypeSchema);
  if (result.error) {
    const err = result.error.details[0];
    return ReE(res, err, 400, result);
  }
  try {
    const response = await registerVehicleTypeService(req.body);

    if (response.error) {
      return ReE(res, response.error, 400);
    }
    return ReS(res, response, 200);
  } catch (e) {
    return ReE(res, '500', 500, e);
  }
};

const registerVehicle = async (req, res) => {
  const result = joiValidation(req.body, vehicleSchema);
  if (result.error) {
    const err = result.error.details[0];
    return ReE(res, err, 400, result);
  }
  try {
    const response = await registerVehicleService(req.body);

    if (response.error) {
      return ReE(res, response.error, 400);
    }
    return ReS(res, response, 200);
  } catch (e) {
    return ReE(res, '500', 500, e);
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const typeId = req.params.typeId;
    let response;
    if (typeId === 'vehicle') {
      response = await fillAllVehicles();
    } else {
      response = await fillAllVehicles(typeId);
    }
    return ReS(res, response, 200);
  } catch (e) {
    return ReE(res, '500', 500, e);
  }
};

module.exports = {
  registerVehicleType,
  registerVehicle,
  getAllVehicles,
};

const { DEFAULT_TYPE } = require('../../common/utils/constant');
const {
  findVehicleType,
  saveVehicleType,
  saveVehicle,
  findVehicle,
  findAllVehicle,
} = require('./vehicle.repository');

const registerVehicleTypeService = async (data) => {
  const promise = [];
  for (const vehicle of data) {
    const isExist = await findVehicleType({ typeName: vehicle.typeName });

    if (isExist) {
      return { error: 'Vehicle type already exists' };
    }

    promise.push(saveVehicleType(vehicle));
  }

  return Promise.all(promise);
};

const registerVehicleService = async (data) => {
  const isExist = await findVehicle({ licensePlate: data.licensePlate });

  if (isExist) {
    return { error: 'Vehicle already exists' };
  }

  let validateType = await findVehicleType({
    $or: [
      {
        model: { $in: [data.model] },
        yearInit: { $gt: data.year },
        brand: data.brand,
      },
    ],
  });

  if (!validateType) {
    validateType = await findVehicleType({ typeName: DEFAULT_TYPE });
  }

  data.typeId = String(validateType.id);

  return saveVehicle(data);
};

const fillAllVehicles = async (typeId) => {
  return findAllVehicle(typeId);
};

module.exports = {
  registerVehicleTypeService,
  registerVehicleService,
  fillAllVehicles,
};

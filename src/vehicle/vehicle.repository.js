const VehicleType = require('../../db/schema/vehicleType.schema');
const Vehicle = require('../../db/schema/vehicle.schema');

const saveVehicleType = async (data) => {
  const saveVehicleType = new VehicleType(data);
  return saveVehicleType.save();
};

const findVehicleType = async (filter) => {
  return VehicleType.findOne(filter);
};
const saveVehicle = async (data) => {
  const saveVehicle = new Vehicle(data);
  return saveVehicle.save();
};

const findVehicle = async (filter) => {
  return Vehicle.findOne(filter);
};

const findAllVehicle = async (typeId) => {
  const filter = [
    {
      $lookup: {
        from: 'vehicletypes',
        localField: 'id',
        foreignField: 'id',
        as: 'vehicleType',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'id',
        foreignField: 'id',
        as: 'user',
      },
    },
  ];

  return Vehicle.aggregate(filter).then((vehicle) => {
    vehicle.map(
      (vehicle) =>
        (vehicle.vehicleType = vehicle.vehicleType.filter(
          (vt) => String(vt._id) === String(vehicle.typeId),
        )[0]),
    );

    vehicle.map(
      (vehicle) =>
        (vehicle.user = vehicle.user.filter(
          (u) => String(u._id) === String(vehicle.userId),
        )[0]),
    );
    if (typeId) {
      vehicle = vehicle.filter((v) => String(v.typeId) === String(typeId));
    }
    return vehicle;
  });
};

module.exports = {
  saveVehicleType,
  findVehicleType,
  saveVehicle,
  findVehicle,
  findAllVehicle,
};

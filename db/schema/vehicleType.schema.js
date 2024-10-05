const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: [String],
      required: true,
    },
    yearInit: {
      type: Number,
      required: false,
    },
    yearFinish: {
      type: Number,
      required: false,
    },
    typeName: {
      type: String,
      enum: ['Espectacular', 'Pickup/Camioneta', 'Economico'],
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      required: false,
    },
  },
  { timestamps: true },
);

const vehicleTypes = mongoose.model('vehicleTypes', vehicleTypeSchema);

module.exports = vehicleTypes;

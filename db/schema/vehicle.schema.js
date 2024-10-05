const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    color: String,
    licensePlate: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'vehicleType',
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

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;

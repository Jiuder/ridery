const mongoose = require('mongoose');
const CONFIG = require('../config/config');

const client = mongoose
  .connect(CONFIG.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection established'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

module.exports = client;

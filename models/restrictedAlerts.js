const mongoose = require('mongoose');

const alertDataSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  type: { type: String, required: true },
  vehicle_id: { type: String, required: true }
});

const AlertData = mongoose.model('AlertData', alertDataSchema);

module.exports = AlertData;

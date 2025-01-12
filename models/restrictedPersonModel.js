const mongoose = require("mongoose");


const restrictedPersonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    rId: { type: String, required: true },
    reason: { type: String, required: true },
    images: [String],
    date: { type: Date, default: Date.now },
  });

exports.RestrictedPerson = mongoose.model("RestrictedPerson", restrictedPersonSchema);

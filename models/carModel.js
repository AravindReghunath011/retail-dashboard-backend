const mongoose = require("mongoose");


const carSchema = new mongoose.Schema({
    name: { type: String, required: true },
    numberPlate: { type: String, required: true, unique: true },
    country: { type: String, required: true },
  });


  exports.Car = mongoose.model("Car", carSchema);
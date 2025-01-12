const mongoose = require("mongoose");


const restrictedCarSchema = new mongoose.Schema({
    numberPlate: { type: String, required: true, unique: true },
    reason:{type:String},
    country:{type:String}
  });


  exports.restrictedCar = mongoose.model("RestrictedCar", restrictedCarSchema)
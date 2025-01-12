const express = require("express");
const { RestrictedPerson } = require("../models/restrictedPersonModel");
const { Car } = require("../models/carModel");
const router = express.Router();



router.post("/registerCar", async (req, res) => {
  const { name, numberPlate, country } = req.body;

  if (!name || !numberPlate || !country) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const car = new Car({ name, numberPlate, country });
    await car.save();
    res.status(201).json({ message: "Car registered successfully!" });
  } catch (err) {
    console.error("Error registering car:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Number plate already exists" });
    }
    res.status(500).json({ error: "Failed to register car" });
  }
})

router.post('/webhook',async(req,res)=>{
    console.log(req.body,'req body from webhook')
    res.json({message:"webhook recieved"})
})

router.post('/getRestrictedPerson',async(req,res)=>{
    let name = req.body.searchName
    let id = req.body.searchId
    console.log(name,'name')
    console.log(id,'id')

    let data = await RestrictedPerson.find({name:name,rId:id})
    console.log(data,'data')
    res.json({data:data,message:"data fetched succesfully"})

})

router.post("/restrictPerson", async (req, res) => {
  const { name, gender, rId, reason, images } = req.body;

  if (!name || !gender || !rId || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const restrictedPerson = new RestrictedPerson({ name, gender, rId, reason, images });
    await restrictedPerson.save();
    res.status(201).json({ message: "Restricted person added successfully!" });
  } catch (err) {
    console.error("Error adding restricted person:", err.message);
    res.status(500).json({ error: "Failed to add restricted person" });
  }
})

module.exports = router
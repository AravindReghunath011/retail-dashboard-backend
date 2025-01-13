const express = require("express");
const { RestrictedPerson } = require("../models/restrictedPersonModel");
const { Car } = require("../models/carModel");
const AlertData = require('../models/restrictedAlerts');
const { restrictedCar } = require("../models/restrictedCarModel");
const Person = require("../models/personModel");

const router = express.Router();

module.exports = (io) => {
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
    });

    router.get('/restrictedCars',async(req,res)=>{
      let data = await restrictedCar.find({})
      console.log(data,'data')
      res.json({message:'cards',data:data})
    }) 

    router.post('/restrictPerson',(req,res)=>{
      res.json({message:"ppl"})
    })

    router.post("/webhook", async (req, res) => {
      try { 
        console.log('entered webhook');
        const { type, person_id, vehicle_id } = req.body;
    
        if (!type) {
          return res.status(400).json({ message: "Type field is required" });
        }
    
        if (type === "person_id") {
          if (!person_id) {
            return res.status(400).json({ message: "person_id is required for type 'person_id'" });
          }
    
          // Check in RestrictedPerson
          const person = await RestrictedPerson.findOne({ rId: person_id });
          
          if (person) {
             // Emit an event to notify clients
             io.emit("restrictedPersonFound", {
              message: "Restricted person found",
              person,
            });
            // Create a new AlertData object
            const alertData = new AlertData({
              timestamp: new Date(),
              type: "person_id",
              vehicle_id: person_id,  // You can use person_id or modify the schema to use rId if needed
            });
            await alertData.save();
    
           
    
            return res.json({
              message: "Person found in restricted list",
              person,
            });
          } else {
            return res.json({ message: "Person not found in restricted list" });
          }
        }
    
        if (type === "vehicle_id") {
          if (!vehicle_id) {
            return res.status(400).json({ message: "vehicle_id is required for type 'vehicle_id'" });
          }
    
          // Check in Car
          const vehicle = await restrictedCar.findOne({ numberPlate: vehicle_id });
    
          if (vehicle) {
            // Create a new AlertData object
            const alertData = new AlertData({
              timestamp: new Date(),
              type: "vehicle_id",
              vehicle_id: vehicle_id, // Store the vehicle number plate or identifier
            });
            await alertData.save();
    
            return res.json({
              message: "Vehicle found in restricted list",
              vehicle,
            });
          } else {
            return res.json({ message: "Vehicle not found in restricted list" });
          }
        }
    
        // If type is not recognized
        return res.status(400).json({ message: "Invalid type provided" });
      } catch (error) {
        console.error("Error handling webhook:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });

    router.get('/getRestrictedList',async(req,res)=>{
      let data = await AlertData.find({})
      console.log(data)
      res.json({data})
    })

    router.post('/registerPerson', async (req, res) => {
      try {
        // Get data from the request body
        const { timestamp, type, person_id, image_name, image_data } = req.body;
    
        // Validate if all required fields are provided
        if (!timestamp || !type || !person_id || !image_name || !image_data) {
          return res.status(400).json({ message: 'All fields are required.' });
        }
    
        // Create a new Person instance with the provided data
        const person = new Person({
          timestamp,
          type,
          person_id,
          image_name,
          image_data,
        });
    
        // Save the person to the database
        const savedPerson = await person.save();
        
        // Respond with the saved person data
        res.status(201).json({ message: 'Person registered successfully!', data: savedPerson });
      } catch (error) {
        console.error('Error saving person data:', error);
        res.status(500).json({ message: 'Error registering person', error: error.message });
      }
    });

    router.post("/getRestrictedPerson", async (req, res) => {
        let name = req.body.searchName;
        let id = req.body.searchId;
        console.log(name, "name");
        console.log(id, "id");

        try {
            let data = await RestrictedPerson.find({ name: name, rId: id });
            console.log(data, "data");

            if (data.length > 0) {
                // Emit an event to notify clients
                io.emit("restricted-person-found", {
                    message: "Restricted person found via search",
                    data,
                });
            }

            res.json({ data: data, message: "Data fetched successfully" });
        } catch (error) {
            console.error("Error fetching restricted person:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    router.post("/restrictCar", async (req, res) => {
      try {
        console.log('entered')
        const { numberPlate,reason,country } = req.body;
    
        // Validate the input
        if (!numberPlate) {
          return res.status(400).json({ message: "Number Plate is required" });
        }
    
        // Check if the car is already in the restricted list
        const existingCar = await restrictedCar.findOne({ numberPlate });
    
        if (existingCar) {
          return res.status(400).json({ message: "Car is already in the restricted list" });
        }
    
        // If the car is not restricted, add it to the list
        const newRestrictedCar = new restrictedCar({
          numberPlate,
          reason,
          country
        });
    
        await newRestrictedCar.save();
    
        // Respond with success message
        res.status(200).json({ message: "Car has been restricted successfully", car: newRestrictedCar });
    
      } catch (error) {
        console.error("Error handling restrict car:", error.message);
        res.status(500).json({ message: "Internal server error" });
      }
    });

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
    });

    return router;
};

const express = require("express");
const { RestrictedPerson } = require("../models/restrictedPersonModel");
const { Car } = require("../models/carModel");
const AlertData = require('../models/restrictedAlerts');

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
            // Create a new AlertData object
            const alertData = new AlertData({
              timestamp: new Date(),
              type: "person_id",
              vehicle_id: person_id,  // You can use person_id or modify the schema to use rId if needed
            });
            await alertData.save();
    
            // Emit an event to notify clients
            io.emit("restrictedPersonFound", {
              message: "Restricted person found",
              person,
            });
    
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
          const vehicle = await Car.findOne({ numberPlate: vehicle_id });
    
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

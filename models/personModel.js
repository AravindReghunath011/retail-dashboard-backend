const mongoose = require('mongoose');

// Define the schema for the Person model
const personSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,  // Automatically set the current timestamp if not provided
  },
  type: {
    type: String,
    required: true,  // Ensure the type is provided
  },
  person_id: {
    type: String,
    required: true,  // Ensure the person_id is provided
  },
  image_name: {
    type: String,
    required: true,  // Ensure the image_name is provided
  },
  image_data: {
    type: String,
    required: true,  // Ensure the image_data (base64) is provided
  },
});

// Create the Person model using the schema
const Person = mongoose.model('Person', personSchema);

module.exports = Person;

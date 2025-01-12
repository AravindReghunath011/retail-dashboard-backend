const mongoose = require("mongoose");

mongoose
  // .connect("mongodb://localhost:27017/carRegistry")
  .connect("mongodb+srv://Rohan:1234567890@cluster0.matpx.mongodb.net/retail-dashboard?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));
   
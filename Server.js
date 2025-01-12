const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routes/route.js")
const app = express();
require('./dbConfig/config.js') 

// Middleware
app.use(cors());
app.use(bodyParser.json());
 
app.use("/api",router);

// Server setup
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

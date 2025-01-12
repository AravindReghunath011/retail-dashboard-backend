const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const routes = require("./routes/route");
require('./dbConfig/config');

const app = express();
const server = http.createServer(app);

// Allow CORS for the Express app
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE"); // Allow specific HTTP methods
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers
    next();
});

// Create the Socket.IO server with CORS enabled
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"], // Allow specific methods
    },
});

// Pass the io instance to the routes
app.use("/api", routes(io));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

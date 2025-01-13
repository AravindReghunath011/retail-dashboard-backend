const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const routes = require("./routes/route");
require('./dbConfig/config');

const app = express();
const server = http.createServer(app);
const hostname = '0.0.0.0';

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

// Serve the React static files (from build or dist folder)
const reactBuildPath = path.join(__dirname, "dist"); // Adjust to 'build' for CRA
app.use(express.static(reactBuildPath));

// Catch-all route to serve React's index.html for frontend routes
app.get("*", (req, res) => {
    res.sendFile(path.join(reactBuildPath, "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, hostname, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

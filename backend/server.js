const express = require("express");

const app = express();
const PORT = 5000;

// Middleware to parse incoming JSON
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to CivicPulse API!");
});

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "CivicPulse backend is running!",
        status: "healthy"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`CivicPulse server running at http://localhost:${PORT}`);
});
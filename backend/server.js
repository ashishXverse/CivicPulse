const express = require("express");

const app = express();
const PORT = 5000;

// Temporary in-memory storage for complaints
const complaints = [];
let nextComplaintId = 1;

// Middleware: Parse incoming JSON requests
app.use(express.json());

// 1. Welcome route
app.get("/", (req, res) => {
    res.status(200).send("Welcome to CivicPulse API!");
});

// 2. Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CivicPulse backend is running!",
        status: "healthy"
    });
});

// 3. Submit a new complaint
app.post("/api/complaints", (req, res) => {
    const { title, description, category, location } = req.body;

    // Validate required fields
    if (
        typeof title !== "string" || !title.trim() ||
        typeof description !== "string" || !description.trim() ||
        typeof category !== "string" || !category.trim() ||
        typeof location !== "string" || !location.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid title, description, category, and location."
        });
    }

    // Create the complaint
    const newComplaint = {
        id: nextComplaintId++,
        title: title.trim(),
        description: description.trim(),
        category: category.trim().toLowerCase(),
        location: location.trim(),
        status: "pending",
        createdAt: new Date().toISOString()
    };

    // Store complaint temporarily
    complaints.push(newComplaint);

    // Send success response
    return res.status(201).json({
        success: true,
        message: "Complaint submitted successfully!",
        data: newComplaint
    });
});

// 4. Get all complaints
app.get("/api/complaints", (req, res) => {
    res.status(200).json({
        success: true,
        count: complaints.length,
        data: complaints
    });
});

// 5. Get a complaint by ID
app.get("/api/complaints/:id", (req, res) => {
    const complaintId = Number(req.params.id);

    if (!Number.isInteger(complaintId) || complaintId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid complaint ID."
        });
    }

    const complaint = complaints.find(
        (item) => item.id === complaintId
    );

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found."
        });
    }

    return res.status(200).json({
        success: true,
        data: complaint
    });
});

// 6. Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// 7. Handle unexpected errors
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);

    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred."
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`CivicPulse server running at http://localhost:${PORT}`);
});
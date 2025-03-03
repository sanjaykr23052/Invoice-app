const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
const Invoice = require("./models/Invoice"); // Ensure Invoice model is imported

dotenv.config(); // Load environment variables

// Connect to MongoDB with error handling
connectDB()
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1); // Exit process if DB connection fails
  });

const app = express();

// Allowed origins for CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",") // Read from .env
  : ["https://test-techdevise.com", "https://techdevise.com"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies if needed
  })
);

// Middleware
app.use(express.json()); // Allows Express to handle JSON requests

// Register API routes
app.use("/api/admin", adminRoutes);

// API Route to Get an Invoice by ID
// app.get("/api/admin/invoices/:id", async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ message: "Invalid Invoice ID format" });
//     }

//     const invoice = await Invoice.findById(req.params.id);

//     if (!invoice) {
//       return res.status(404).json({ message: "Invoice not found in the database" });
//     }

//     res.json(invoice);
//   } catch (error) {
//     console.error("Error fetching invoice:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// Define the port from environment variables or use default 4000
const PORT = process.env.PORT || 4000;

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

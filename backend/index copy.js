const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");
const Invoice = require("./models/Invoice"); // Ensure Invoice model is imported

dotenv.config(); // Load environment variables

// Connect to MongoDB with error handling
connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1); // Exit process if DB connection fails
});

const app = express();

const allowedOrigins = [
  "https://test-techdevise.com", 
  "https://techdevise.com", 
];

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

// Register your routes
app.use("/api/admin", adminRoutes);

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
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

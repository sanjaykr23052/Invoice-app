const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MongoDB URI is not defined in .env");
    }

    // Connect to MongoDB using the URI from .env
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Stop the server if MongoDB connection fails
  }
};

module.exports = connectDB;


const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.mongo_uri;

    if (!mongoUri) {
      throw new Error("MongoDB URI missing. Add MONGODB_URI or mongo_uri in .env");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
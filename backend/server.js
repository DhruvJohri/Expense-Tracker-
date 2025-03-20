require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");



process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
});


console.log('Environment variables check at startup:');
console.log({
  NODE_ENV: process.env.NODE_ENV || 'not set',
  MONGO_URI: process.env.MONGO_URI ? 'set (value hidden)' : 'not set',
  JWT_SECRET: process.env.JWT_SECRET ? 'set (value hidden)' : 'not set',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? 'set (value hidden)' : 'not set',
  PORT: process.env.PORT || 'not set',
  CLIENT_URL: process.env.CLIENT_URL || 'not set',
});

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/test', (req, res) => {
  res.json({ status: 'Server is running, but DB connection may have failed' });
});

app.get('/debug', (req, res) => {
  const envStatus = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    MONGO_URI: process.env.MONGO_URI ? 'set (value hidden)' : 'not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'set (value hidden)' : 'not set',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? 'set (value hidden)' : 'not set',
    PORT: process.env.PORT || 'not set',
    CLIENT_URL: process.env.CLIENT_URL || 'not set',
    mongodb_connected: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  };
  
  res.json(envStatus);
});


// Connect to MongoDB
console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000 // Timeout after 10 seconds
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    // Try to create a minimal server even if DB connection fails
    console.log("Continuing server initialization despite MongoDB connection error");
  });

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));

// Start Server in development mode only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export the Express app for Vercel serverless functions
module.exports = app;

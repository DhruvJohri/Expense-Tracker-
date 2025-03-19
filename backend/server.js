require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Add this at the top of server.js
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
});

// Log all environment variables at startup (redacted for security)
console.log('Environment variables check at startup:');
console.log({
  NODE_ENV: process.env.NODE_ENV || 'not set',
  MONGO_URI: process.env.MONGO_URI ? 'set (value hidden)' : 'not set',
  JWT_SECRET: process.env.JWT_SECRET ? 'set (value hidden)' : 'not set',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? 'set (value hidden)' : 'not set',
  PORT: process.env.PORT || 'not set',
  CLIENT_URL: process.env.CLIENT_URL || 'not set',
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// More permissive CORS settings
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if(!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:5173', 
            'http://localhost:5174',
            'https://expense-tracker-vercel.app',
            'https://expense-tracker-frontend.vercel.app',
            'https://expense-tracker-dhruv-johri.vercel.app',
            'https://expense-tracker-.vercel.app',
            'https://expense-tracker-git-main-dhruv-johri.vercel.app',
            'https://expense-tracker-five-self.vercel.app',
            'https://expense-tracker-seven.vercel.app',
            'https://expense-tracker-backend.vercel.app'
            'https://expense-tracker-duco.vercel.app'
        ];
        
        // Check if the origin is allowed
        if(allowedOrigins.indexOf(origin) === -1) {
            // If it's not in our list, log it but still allow it in development
            console.log('Origin not allowed by CORS:', origin);
            if(process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
        }
        
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

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

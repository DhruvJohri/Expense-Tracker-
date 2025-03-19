/**
 * Expense Tracker Deployment Guide
 * 
 * This file contains instructions for deploying the Expense Tracker app to Vercel.
 * Follow these steps in order:
 */

/**
 * Step 1: Deploy the Backend
 * 
 * Run the following commands in your terminal:
 * cd expense-tracker/backend
 * vercel login
 * vercel
 * 
 * During deployment:
 * - Create a new project if asked
 * - Set the following environment variables:
 *   - MONGO_URI: Your MongoDB connection string
 *   - JWT_SECRET: A secure random string for JWT token generation
 *   - CLIENT_URL: Your frontend URL (can update later)
 */

/**
 * Step 2: Get Your Backend URL
 * 
 * After deployment, Vercel will provide a URL for your backend.
 * Copy this URL as you'll need it for the frontend.
 * Example: https://expense-tracker-backend.vercel.app
 */

/**
 * Step 3: Update Frontend Environment Variable
 * 
 * Edit the .env file in the expense-tracker directory:
 * VITE_API_URL=https://your-backend-url.vercel.app/api
 */

/**
 * Step 4: Deploy the Frontend
 * 
 * Run the following commands in your terminal:
 * cd expense-tracker
 * vercel login
 * vercel
 * 
 * During deployment:
 * - Create a new project if asked
 * - Set environment variables if prompted
 */

/**
 * Step 5: Update Backend CORS Configuration
 * 
 * Go to your Vercel dashboard:
 * 1. Select your backend project
 * 2. Go to Settings > Environment Variables
 * 3. Update CLIENT_URL with your frontend URL
 * 4. Redeploy by running: vercel --prod
 */

/**
 * Step 6: Test Your Application
 * 
 * Visit your frontend URL to test the complete application.
 * If you encounter any CORS issues, make sure the backend server.js
 * has the correct frontend URL in the CORS configuration.
 */

// This is just a helper file, no code execution here
console.log("Please follow the deployment steps outlined in this file."); 
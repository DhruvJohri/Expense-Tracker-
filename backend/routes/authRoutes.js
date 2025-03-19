const express = require("express");
const { 
    registerUser, 
    loginUser, 
    refreshToken, 
    logoutUser,
    getCurrentUser
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);

// Protected routes
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;

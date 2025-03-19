const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Generate tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};

// Set HTTP-only cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
    // Set access token cookie (short-lived)
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Set refresh token cookie (long-lived)
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({ 
            firstName, 
            lastName, 
            email, 
            password: hashedPassword 
        });
        await user.save();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Set HTTP-only cookies
        setTokenCookies(res, accessToken, refreshToken);

        res.status(201).json({ 
            message: "User registered successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            accessToken, // Include the access token in the response
            refreshToken // Include the refresh token in the response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Set HTTP-only cookies
        setTokenCookies(res, accessToken, refreshToken);

        res.json({ 
            message: "Login successful",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            accessToken, // Include the access token in the response
            refreshToken // Include the refresh token in the response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Refresh token
const refreshToken = async (req, res) => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Generate new tokens
        const tokens = generateTokens(user._id);
        
        // Set new cookies
        setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
        
        res.json({ 
            message: "Token refreshed successfully",
            accessToken: tokens.accessToken, // Include the new access token in the response
            refreshToken: tokens.refreshToken // Include the new refresh token in the response
        });
    } catch (error) {
        console.error(error);
        
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }
        
        res.status(500).json({ message: "Server error" });
    }
};

// Logout User
const logoutUser = (req, res) => {
    // Clear cookies
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });
    
    res.json({ message: "Logged out successfully" });
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    refreshToken, 
    logoutUser,
    getCurrentUser
};

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Access denied, no token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Find user and attach to request
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        console.error(error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                message: "Token expired", 
                expired: true 
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        res.status(500).json({ message: "Server error" });
    }
};

module.exports = authMiddleware;

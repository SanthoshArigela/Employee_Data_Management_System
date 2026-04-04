const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Employee = require('../models/Employee'); // Import Employee model
const bcrypt = require('bcryptjs');

// Helper middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ message: "Not authenticated" });
};

// Route: Login
// Description: Authenticates the user (Admin or Employee) and creates a session
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // 1. Check if it's an Admin login
        let user = await User.findOne({ username });
        let isEmployee = false;

        // 2. If not an Admin, check if it's an Employee login
        if (!user) {
            user = await Employee.findOne({ username });
            isEmployee = true;
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Save user ID and role in session
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.role = isEmployee ? 'employee' : 'admin';
        
        res.status(200).json({ 
            message: "Logged in successfully", 
            username: user.username,
            role: req.session.role
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
});

// Route: Logout
// Description: Destroys the user session
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out" });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie from the browser
        res.status(200).json({ message: "Logged out successfully" });
    });
});

// Route: Me
// Description: Checks if user is currently logged in, used by frontend on page load
router.get('/me', isAuthenticated, (req, res) => {
    res.status(200).json({ 
        username: req.session.username,
        role: req.session.role 
    });
});

module.exports = { authRouter: router, isAuthenticated };

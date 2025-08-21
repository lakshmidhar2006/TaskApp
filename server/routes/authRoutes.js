const express = require('express');
const router = express.Router();
const user = require('../models/user'); 
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware'); 

const JWT_SECRET = process.env.JWT_SECRET

// LOGIN
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });    
    }
    try {
        const existingUser = await user.findOne({ email, password });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT
        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "strict"
        });

        console.log('User logged in:', existingUser);
        return res.json({ message: 'User logged in successfully', email });
    } catch(err) {
        console.error('Error during login:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// SIGNUP 
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    try {
        // Create new user
        const newUser = new user({ name, email, password });
        await newUser.save();
        console.log('User signed up:', newUser);

        // Create JWT immediately
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });

        return res.json({ message: 'User signed up and logged in successfully', name, email });
    } catch(err) {
        console.error('Error during signup:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});




router.get('/me', authMiddleware, async (req, res) => {
    try {
        
        const existingUser = await user.findById(req.user.id).select("-password"); 
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(existingUser);
    } catch (err) {
        console.error("Error fetching user:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;

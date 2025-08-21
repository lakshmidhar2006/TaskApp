const express = require('express');
const router = express.Router();
const user = require('../models/user'); 
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });    
    }
    try{
        const existingUser = await user.findOne({ email, password });
        res.status(200);
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log('User logged in:', existingUser);
    }
    catch(err){
        console.error('Error during login:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ message: 'User logged in successfully', email });
});

router.post('/signup',async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    try{
        const newUser = new user({ name, email, password });
        await newUser.save();
        console.log('User signed up:', newUser);
     
    }
    catch(err){
        console.error('Error during signup:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ message: 'User signed up successfully', name, email });
});
module.exports = router;
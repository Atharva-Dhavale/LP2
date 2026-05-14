const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// Register a new user for the event
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, ticketType } = req.body;
    
    // Basic validation
    if (!fullName || !email || !phone || !ticketType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newRegistration = new Registration({
      fullName,
      email,
      phone,
      ticketType
    });

    const savedRegistration = await newRegistration.save();
    res.status(201).json({ message: 'Registration successful!', registration: savedRegistration });
  } catch (error) {
    console.error('Error in /register:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Get all registrations (for dashboard)
router.get('/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error in /registrations:', error);
    res.status(500).json({ message: 'Server error while fetching registrations' });
  }
});

module.exports = router;

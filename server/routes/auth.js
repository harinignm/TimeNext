const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email is already registered. Please login.' });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).send({ error: error.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET || 'secret');
    res.send({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).send({ error: error.message || 'Login failed' });
  }
});

module.exports = router;

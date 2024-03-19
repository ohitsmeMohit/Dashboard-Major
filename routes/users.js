// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup route with server-side validation
router.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Validate username format (alphanumeric only)
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({ error: 'Username must contain only alphanumeric characters' });
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }
    // Create session data
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email
    };
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // Destroy session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.clearCookie('connect.sid'); // Clear session cookie
      res.json({ message: 'Logout successful' });
    }
  });
});
module.exports = router;


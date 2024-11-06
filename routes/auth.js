const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    res.status(400).send('Error signing up: ' + error.message);
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    
    // Save user session info
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    res.status(400).send('Error logging in: ' + error.message);
  }
});

module.exports = router;

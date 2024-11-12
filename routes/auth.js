const express = require('express');
const router = express.Router();
const User = require('../models/User.js');

// Register Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send('Invalid email or password');
    }
    req.session.user = { username: user.username, email: user.email };
    user.updateLastLogin(); // Update last login time
    res.render("index", { imageMainUrl: '/image.png', user: req.session.user || null })
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});


module.exports = router;
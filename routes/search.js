// routes/search.js
const express = require('express');
const router = express.Router();
const File = require('../models/File');

// Render the search form
router.get('/', (req, res) => {
  const user = req.session.user || null; // Retrieve user from session
  res.render("search", { user: user, files: null }); // Pass user to the search view
});

// Display search results
router.get('/results', async (req, res) => {
  const user = req.session.user || null;
  const { subjectName, subjectCode, type } = req.query;
  const query = {};
  if (subjectName) query.subject = new RegExp(subjectName, 'i');
  if (subjectCode) query.subjectCode = new RegExp(subjectCode, 'i');
  if (type) query.type = type;

  try {
    const files = await File.find(query);
    res.render('search', { user: user, files: files });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).send('Error retrieving files');
  }
});

module.exports = router;
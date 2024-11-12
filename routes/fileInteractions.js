// routes/fileInteractions.js
const express = require('express');
const router = express.Router();
const File = require('../models/File');

// Handle file like
router.post('/like/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ success: false, message: 'File not found' });

        // Increment likes
        file.likes = (file.likes || 0) + 1;
        await file.save();

        res.json({ success: true, likes: file.likes });
    } catch (error) {
        console.error('Error updating likes:', error);
        res.status(500).json({ success: false, message: 'Error updating likes' });
    }
});

// View a single file and its comments
router.get('/:fileId', async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    res.render('viewFile', { file });
  } catch (error) {
    console.error('Error loading file:', error);
    res.status(500).send('Error loading file');
  }
});

router.get('/view/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).send('File not found');
        
        // Render viewFile.ejs with the file details
        res.render('viewFile', { file: file });
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).send(error.message);
    }
  });

// Add a comment to a file
router.post('/:fileId/comment', async (req, res) => {
  const { author, text } = req.body;
  try {
    const file = await File.findById(req.params.fileId);
    file.comments.push({ author, text });
    await file.save();
    res.redirect(`/file/${req.params.fileId}`);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
});



module.exports = router;

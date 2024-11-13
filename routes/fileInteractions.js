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

        const user = req.session.user || null;
        // Render viewFile.ejs with the file details
        res.render('viewFile', {user: user, file: file });
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).send(error.message);
    }
  });

// Add a comment to a file
// router.post('/:fileId/comment', async (req, res) => {
//   const { author, text } = req.body;
//   try {
//     const file = await File.findById(req.params.fileId);
//     file.comments.push({ author, text });
//     await file.save();
//     res.redirect(`/file/${req.params.fileId}`);
//   } catch (error) {
//     console.error('Error adding comment:', error);
//     res.status(500).send('Error adding comment');
//   }
// });

// Ensure user is logged in before posting a comment
router.post('/:fileId/comment', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Please log in to comment." });
    }
  
    const { fileId } = req.params;
    const { text } = req.body;  // Get the text from the body
    const author = req.session.user.name;  // Assuming user data is stored in session
  
    // Check if text is empty or not provided
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Comment body is required." });
    }
  
    try {
      // Add the comment to the file document
      const file = await File.findByIdAndUpdate(
        fileId,
        { $push: { comments: { author, text, date: new Date() } } },
        { new: true }
      );
  
      // Check if the file and comment were updated successfully
      if (!file) {
        return res.status(404).json({ error: "File not found." });
      }
  
      const newComment = file.comments[file.comments.length - 1];
  
      // Return the newly added comment data as JSON response
      res.json({
        author: newComment.author,
        text: newComment.text,
        date: newComment.date
      });
  
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Error adding comment." });
    }
  });
  
module.exports = router;

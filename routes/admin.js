const express = require('express');
const router = express.Router();
const File = require('../models/File');
const isAdmin = require('../middlewares/isAdmin');

// List unverified notes
router.get('/', isAdmin, async(req, res) => {
    try {
        const unverifiedFiles = await File.find({ isVerified: false });
        res.render('adminNotes', { files: unverifiedFiles });
    } catch (error) {
        res.status(500).send('Error fetching notes');
    }
});

// Verify a note
router.post('/verify-note', isAdmin, async (req, res) => {
    const { noteId } = req.body;
    try {
        await File.findByIdAndUpdate(noteId, { isVerified: true });
        res.redirect('/admin'); // Refresh the notes page after verification
    } catch (error) {
        console.error('Error verifying note:', error);
        res.status(500).send('Server error');
    }
});

// Delete a note
router.post('/delete-note', isAdmin, async (req, res) => {
    const { noteId } = req.body;
    try {
        await File.findByIdAndDelete(noteId);
        res.redirect('/admin'); // Refresh the notes page after deletion
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
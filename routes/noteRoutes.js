


// router.get('/', authMiddleware, async (req, res) => {
//     const 
const express = require('express');
const router = express.Router();
const Note = require('../models/notes'); // import model in routes folder 
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Show Notes 
// router.get('/', auth, async (req, res) => {
//     const notes = await Note.find({ user: req.userId });
//     res.render('index', { notes });
// });
router.get('/', auth, async (req, res) => {
    try {
        const sortOrder = req.query.sort === 'oldest' ? 'oldest' : 'newest';
        const sortDirection = sortOrder === 'oldest' ? 1 : -1;
        const parsedPage = Number.parseInt(req.query.page, 10);
        const requestedPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
        const notesPerPage = 5;
        const noteFilter = {
            $or: [
                { user: req.userId },
                { user: { $exists: false } } // legacy documents
            ]
        };

        // we store a user reference on each note; older documents
        // created before the schema had that field will not match
        
        // the page still shows those notes when you're troubleshooting
        const totalNotes = await Note.countDocuments(noteFilter);
        const totalPages = Math.max(1, Math.ceil(totalNotes / notesPerPage));
        const currentPage = Math.min(requestedPage, totalPages);
        const notes = await Note.find(noteFilter)
            .sort({ createdAt: sortDirection })
            .skip((currentPage - 1) * notesPerPage)
            .limit(notesPerPage);

        res.render('index', { notes, sortOrder, currentPage, totalPages, totalNotes });
    } catch (err) {
        console.log(err);
        res.send("Error loading notes");
    }
});

// Create Note
router.post('/create', auth, upload.single('media'), async (req, res) => {
    try {
        await Note.create({
            title: req.body.title,
            content: req.body.content,
            media: req.file ? req.file.filename : null,
            user: req.userId
        });
//flash message 
        req.flash('success', 'Note created successfully.');
        res.redirect('/notes');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Could not create note. Please try again.');
        res.redirect('/notes');
    }
});

// Delete Note
router.post('/delete/:id', auth, async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        req.flash('success', 'Note deleted successfully.');
        res.redirect('/notes');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Could not delete note. Please try again.');
        res.redirect('/notes');
    }
});

// Edit Note - Show Form
router.get('/edit/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            req.flash('error', 'Note not found.');
            return res.redirect('/notes');
        }
        res.render('edit', { note });
    } catch (err) {
        console.log(err);
        req.flash('error', 'Could not open note for editing.');
        res.redirect('/notes');
    }
});

// Edit Note - Update
router.post('/edit/:id', auth, upload.single('media'), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            content: req.body.content
        };
        
        if (req.file) {
            updateData.media = req.file.filename;
        }
        
        await Note.findByIdAndUpdate(req.params.id, updateData);
        req.flash('success', 'Note updated successfully.');
        res.redirect('/notes');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Could not update note. Please try again.');
        res.redirect('/notes');
    }
});

module.exports = router;

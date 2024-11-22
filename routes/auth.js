// const express = require('express');
// const router = express.Router();
// const User = require('../models/User.js');

// // Register Route
// router.post('/signup', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const user = new User({ username, email, password });
//     await user.save();
//     res.send('User registered successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error registering user');
//   }
// });

// // Login Route
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(400).send('Invalid email or password');
//     }
//     req.session.user = { username: user.username, email: user.email };
//     user.updateLastLogin(); // Update last login time
//     res.render("index", { imageMainUrl: '/image.png', user: req.session.user || null })
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error.message);
//   }
// });

// router.get('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error('Logout error:', err);
//     }
//     res.redirect('/');
//   });
// });


// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const User = require('../models/User.js');
// const nodemailer = require('nodemailer');

// // Configure nodemailer
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'notecraft90@gmail.com', // Replace with your email
//         pass: 'hdal yhop ibtj bqlr'     // Replace with your app password
//     }
// });

// // Register Route
// router.post('/signup', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const user = new User({ username, email, password });
        
//         // Generate verification token
//         const verificationToken = user.generateVerificationToken();
        
//         await user.save();

//         // Send verification email
//         const verificationUrl = `http://localhost:5000/verify-email?token=${verificationToken}`;
//         const mailOptions = {
//             from: 'your-email@gmail.com',
//             to: user.email,
//             subject: 'Email Verification - Notecraft',
//             html: `
//                 <h1>Verify Your Email</h1>
//                 <p>Please click the link below to verify your email address:</p>
//                 <a href="${verificationUrl}">Verify Email</a>
//                 <p>This link will expire in 24 hours.</p>
//             `
//         };

//         await transporter.sendMail(mailOptions);
//         res.render('verification-sent', { email: user.email });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error registering user');
//     }
// });

// // Email Verification Route
// router.get('/verify-email', async (req, res) => {
//     try {
//         const { token } = req.query;
//         const user = await User.findOne({
//             emailVerificationToken: token,
//             emailVerificationExpires: { $gt: Date.now() }
//         });

//         if (!user) {
//             return res.status(400).render('verification-error', {
//                 message: 'Invalid or expired verification token.'
//             });
//         }

//         user.isEmailVerified = true;
//         user.emailVerificationToken = undefined;
//         user.emailVerificationExpires = undefined;
//         await user.save();

//         res.render('verification-success');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error verifying email');
//     }
// });

// // Login Route
// router.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });
        
//         if (!user || !(await user.comparePassword(password))) {
//             return res.status(400).send('Invalid email or password');
//         }

//         if (!user.isEmailVerified) {
//             return res.render('verification-required', { email: user.email });
//         }

//         req.session.user = { username: user.username, email: user.email };
//         user.updateLastLogin();
//         res.render("index", { imageMainUrl: '/image.png', user: req.session.user || null });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(error.message);
//     }
// });

// router.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Logout error:', err);
//         }
//         res.redirect('/');
//     });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'notecraft90@gmail.com',
        pass: 'hdal yhop ibtj bqlr'
    }
});

// Register Route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        
        // Generate verification token
        const verificationToken = user.generateVerificationToken();
        
        await user.save();

        // Send verification email
        const verificationUrl = `http://localhost:5000/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: user.email,
            subject: 'Email Verification - Notecraft',
            html: `
                <h1>Verify Your Email</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.render('verification-sent', { email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

// Email Verification Route
router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).render('verification-error', {
                message: 'Invalid or expired verification token.'
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.render('verification-success');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error verifying email');
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

        if (!user.isEmailVerified) {
            return res.render('verification-required', { email: user.email });
        }

        req.session.user = { username: user.username, email: user.email };
        // Set session expiry
        req.session.cookie.maxAge = 60000; // 1 minute
        
        user.updateLastLogin();
        res.render("index", { imageMainUrl: '/image.png', user: req.session.user || null });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Modified logout route to handle both manual and timeout-based logout
// router.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Logout error:', err);
//             return res.status(500).json({ error: 'Logout failed' });
//         }
//         res.redirect('/login');
//     });
// });

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect('/login');
    });
});



module.exports = router;
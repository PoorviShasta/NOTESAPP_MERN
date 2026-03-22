const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Show Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register User
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'User already registered. Please login.');
            return res.redirect('/login');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        req.flash('success', 'Account created successfully. Please login.');
        res.redirect('/login');

    } catch (err) {
        console.log(err);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/register');
    }
});

// Show Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            req.flash('error', 'User not found. Please register first.');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash('error', 'Incorrect password. Please try again.');
            return res.redirect('/login');
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // token valid for 1 day
        );

        // Save token in cookie
        res.cookie('token', token, {
            httpOnly: true
        });

        req.flash('success', 'Login successful.');
        res.redirect('/notes');

    } catch (err) {
        console.log(err);
        req.flash('error', 'Login failed. Please try again.');
        res.redirect('/login');
    }
});

// Logout User
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    req.flash('success', 'Logged out successfully.');
    res.redirect('/login');
});

module.exports = router;

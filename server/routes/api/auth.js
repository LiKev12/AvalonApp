const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET;

// User Model
const User = require('../../models/User');

// @route   POST api/auth
// @desc    Authenticate new user
// @access  Public
router.post('/', (req, res) => {
    const { name, password } = req.body;

    // Simple validation
    if (!name || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    User.findOne({ name }).then(user => {
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        // Validate password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

            jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            });
        });
    });
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id).then(user =>
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    );
});

module.exports = router;

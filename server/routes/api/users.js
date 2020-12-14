const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        console.log('Please enter all fields');
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (name.length < 4) {
        console.log('Username must contain at least 4 characters');
        return res.status(400).json({ msg: 'Username must contain at least 4 characters' });
    }

    if (!RegExp('^[a-zA-Z0-9-_]+$').test(name)) {
        console.log('Username must be alphanumeric, can include dashes and underscores');
        return res.status(400).json({ msg: 'Username must be alphanumeric, can include dashes and underscores' });
    }

    // Check for existing user
    User.findOne({ email }).then(user => {
        if (user) {
            console.log('User already exists');
            return res.status(400).json({ msg: 'User already exists' });
        }
        const newUser = new User({
            name,
            email,
            password
        });

        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save().then(user => {
                    jwt.sign({ id: user._id }, config.get('jwtSecret'), { expiresIn: 36000 }, (err, token) => {
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
    });
});

module.exports = router;

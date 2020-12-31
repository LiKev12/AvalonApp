const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { ABOUT_START_DATE, ABOUT_END_DATE } = require('../../constants');

// User Model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (name.length < 4) {
        return res.status(400).json({ msg: 'Username must contain at least 4 characters' });
    }

    if (!RegExp('^[a-zA-Z0-9-_]+$').test(name)) {
        return res.status(400).json({ msg: 'Username must be alphanumeric, can include dashes and underscores' });
    }

    // Check for existing user with either same username or email
    User.findOne({ $or: [{ name }, { email }] }).then(user => {
        if (user) {
            const { name: existingName, email: existingEmail } = user;
            if (name === existingName) {
                return res.status(400).json({ msg: 'User already exists with that username' });
            } else if (email === existingEmail) {
                return res.status(400).json({ msg: 'User already exists with that email' });
            }
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
    });
});

/**
 * @route   GET api/users/getUsersOverTime
 * @desc    Gets data including New Users and Total Users aggregated by day
 * @access  Public
 */
router.get('/getUsersOverTime', (req, res) => {
    User.aggregate([
        { $addFields: { dateFormatted: { $dateToString: { format: '%Y-%m-%d', date: '$register_date' } } } },
        {
            $group: {
                _id: '$dateFormatted',
                numUsers: {
                    $sum: 1
                }
            }
        },
        { $sort: { _id: 1 } }
    ]).then(data => {
        // 1) Transform into [{Date, 'New Users'}]
        const usersOverTimeData = data.map(singleDayData => {
            const { _id, numUsers } = singleDayData;
            return {
                Date: _id,
                'New Users': numUsers
            };
        });

        // 2) Fill in in-between dates
        const usersOverTimeDataPadded = getDataWithPaddedDates(usersOverTimeData);

        // 3) Get aggregate users ('Total Users')
        let totalUsersCounter = 0;
        for (let i = 0; i < usersOverTimeDataPadded.length; i++) {
            totalUsersCounter += usersOverTimeDataPadded[i]['New Users'];
            usersOverTimeDataPadded[i]['Total Users'] = totalUsersCounter;
        }

        // 4) Send final time series data
        res.json(usersOverTimeDataPadded);
    });
});

module.exports = router;

const getDataWithPaddedDates = dataOverTime => {
    // 1) Get all dates in between a set START_DATE and END_DATE
    const startDate = ABOUT_START_DATE;
    const endDate = ABOUT_END_DATE;
    const arrInBetweenDates = getArrInBetweenDates(startDate, endDate);

    // 2) Add all the dates in between that are not in original array
    const setOfIncludedDates = new Set(dataOverTime.map(singleDayData => singleDayData.Date));
    arrInBetweenDates.forEach(inBetweenDate => {
        if (!setOfIncludedDates.has(inBetweenDate)) {
            dataOverTime.push({ Date: inBetweenDate, 'New Users': 0 });
        }
    });

    // 3) Sort the dataOverTime array with the additional inbetween dates
    dataOverTime.sort((dataDayA, dataDayB) => dataDayA.Date.localeCompare(dataDayB.Date));
    return dataOverTime;
};

const getArrInBetweenDates = (startDate, endDate) => {
    const arrInBetweenDates = [];
    let nextDate = getNextDateYMD(startDate);
    arrInBetweenDates.push(nextDate);
    while (nextDate !== endDate) {
        nextDate = getNextDateYMD(nextDate);
        arrInBetweenDates.push(nextDate);
    }
    return arrInBetweenDates;
};

const getNextDateYMD = dateYMD => {
    const date = getDateFromYMD(dateYMD);
    date.setDate(date.getDate() + 1);
    const nextDateYMD = getYMDFromDate(date);
    return nextDateYMD;
};

const getDateFromYMD = ymd => {
    const year = ymd.substring(0, 4);
    const month = ymd.substring(5, 7);
    const day = ymd.substring(8, 10);
    const date = new Date(year, month - 1, day);
    return date;
};

const getYMDFromDate = date => {
    const ymd = new Date(date).toISOString().split('T')[0];
    return ymd;
};

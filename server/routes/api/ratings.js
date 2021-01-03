const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// @route GET api/ratings/topRatings/:topK
// @desc Gets topK ratings (for About Page)
// @access Public
router.get('/topRatings/:topK', (req, res) => {
    const { topK } = req.params;
    User.find()
        .sort({ rating: -1 })
        .then(users => {
            const userRatingsTopK = [];
            const numUsers = users.length;
            const topK_limit = Math.min(numUsers, topK);
            for (let i = 0; i < topK_limit; i++) {
                const user = users[i];
                const { name: user_name, rating } = user;
                userRatingsTopK.push({ user_name, rating });
            }
            res.json(userRatingsTopK);
        });
});

// @route GET api/ratings/:user_id
// @desc Gets the requested player's rating (for Stats page)
// @access Public
router.get('/:user_id', (req, res) => {
    const { user_id } = req.params;
    User.findOne({ _id: user_id }).then(user => {
        const { rating } = user;
        res.json(rating);
    });
});

// @route POST api/ratings/getInitialRatings
// @desc Gets (but using POST) a map of user_id to individual initial ratings
// Input: arr_user_ids
// Output: map_id_to_rating
// @access Public
router.post('/getInitialRatings', (req, res) => {
    const arr_user_ids = req.body;
    User.find({ _id: { $in: arr_user_ids } }).then(users => {
        const map_id_to_rating_initial = {};
        users.forEach(user => {
            const { _id, rating } = user;
            map_id_to_rating_initial[_id] = rating;
        });
        res.json(map_id_to_rating_initial);
    });
});

// @route POST api/ratings/setNewRatings
// @desc Update the ratings of each given player
// Input: map_id_to_rating (new)
// Output: map_id_to_rating (new)
// @access Public (for now)
router.post('/setNewRatings', (req, res) => {
    const { arr_user_ids, map_id_to_rating_new } = req.body;
    arr_user_ids.forEach(user_id => {
        const newRating = map_id_to_rating_new[user_id];
        User.findOneAndUpdate({ _id: user_id }, { rating: newRating }, { new: true }, (error, data) => {
            if (error) {
                console.log('error', error);
            } else {
                console.log('[POST api/ratings/setNewRatings]', data);
            }
        });
    });
});

module.exports = router;

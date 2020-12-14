const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// MockGame Model
const MockGame = require('../../models/MockGame');

// @route   GET api/mock_games
// @desc    Get All MockGames
// @access  Public
router.get('/', (req, res) => {
    MockGame.find()
        .sort({ date: -1 })
        .then(mock_games => {
            res.json(mock_games);
        });

    // Get all {date, role, team, result, num_players}
});

// @route   GET api/mock_games
// @desc    Get All MockGames
// @access  Public
router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    MockGame.find({ players: { $elemMatch: { user_id: user_id } } })
        .sort({ date: -1 })
        .then(mock_games => {
            // const mock_games_data = res.json(mock_games);
            const data_to_be_sent = mock_games.map(single_game => {
                const {
                    date,
                    winningTeam,
                    metadata: { map_id_to_role }
                } = single_game;
                const team = map_id_to_role[user_id]['team'];
                const role = map_id_to_role[user_id]['role'];
                return {
                    time: date,
                    team,
                    role,
                    num_players: 5,
                    result: team === winningTeam ? 'WIN' : 'LOSS'
                };
            });
            res.json(data_to_be_sent);
        });
});

// @route   POST api/mock_games
// @desc    Create a Post
// @access  Public
router.post('/', (req, res) => {
    const newMockGame = new MockGame({
        metadata: req.body.metadata,
        history: req.body.history,
        players: req.body.players,
        winningTeam: req.body.winningTeam
    });
    newMockGame.save().then(mock_game => res.json(mock_game));
});

module.exports = router;

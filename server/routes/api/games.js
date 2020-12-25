const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Game Model
const Game = require('../../models/Game');

/**
 * Gets data from all games (for About page)
 * @route   GET api/games
 * @desc    Get All Games
 * @access  Public
 */
router.get('/', (req, res) => {
    Game.find()
        .sort({ date: -1 })
        .then(games => {
            res.json(games);
        });

    // Get all {date, role, team, result, num_players}
});

/**
 * Posts data from completed game to save in database
 * @route   POST api/games
 * @desc    Saves completed game to database
 * @access  Private
 */
router.post('/', (req, res) => {
    const newGame = new Game({
        room_id: req.body.room_id,
        is_public: req.body.is_public,
        is_rated: req.body.is_rated,
        //
        creation_time: req.body.creation_time,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        is_completed: req.body.is_completed,
        //
        players: req.body.players,
        result: req.body.result,
        metadata: req.body.metadata,
        history: req.body.history
    });
    newGame.save().then(game => res.json(game));
});

/**
 * Gets data from only games for specific user (for Stats page)
 * @route   GET api/games/:user_id
 * @desc    Get games for specific user
 * @access  Private
 */
router.get('/:user_id', auth, (req, res) => {
    const user_id = req.params.user_id;
    Game.find({ players: { $elemMatch: { user_id: user_id } } })
        .sort({ date: -1 })
        .then(games => {
            const data_to_be_sent = games.map(single_game => {
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

module.exports = router;

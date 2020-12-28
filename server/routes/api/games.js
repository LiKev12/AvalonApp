const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Game Model
const Game = require('../../models/Game');

/**
 * @route   GET api/games/getGamesOverTime
 * @desc    Gets data including New Games and Total Games aggregated by day
 * @access  Public
 */
router.get('/getGamesOverTime', (req, res) => {
    // Game.find()
    //     .sort({ date: 1 })
    Game.aggregate([
        { $addFields: { dateFormatted: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } } },
        {
            $group: {
                _id: '$dateFormatted',
                numGames: {
                    $sum: {
                        $cond: [{ $eq: ['$is_completed', true] }, 1, 0]
                    }
                }
            }
        },
        { $sort: { _id: 1 } }
    ]).then(data => {
        // 1) Transform into [{Date, 'New Games'}]
        const gamesOverTimeData = data.map(singleDayData => {
            const { _id, numGames } = singleDayData;
            return {
                Date: _id,
                'New Games': numGames
            };
        });

        // 2) Fill in in-between dates
        const gamesOverTimeDataPadded = getDataWithPaddedDates(gamesOverTimeData);

        // 3) Get aggregate games played ('Total Games')
        let totalGamesCounter = 0;
        for (let i = 0; i < gamesOverTimeDataPadded.length; i++) {
            totalGamesCounter += gamesOverTimeDataPadded[i]['New Games'];
            gamesOverTimeDataPadded[i]['Total Games'] = totalGamesCounter;
        }

        // 4) Send final time series data
        res.json(gamesOverTimeDataPadded);
    });
});

/**
 * @route   GET api/games/:user_id
 * @desc    Gets data from only games for specific user (for Stats page)
 * @access  Public
 */
router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    Game.find({ players: { $elemMatch: { user_id: user_id } } })
        .sort({ date: -1 })
        .then(games => {
            const allGamesData = games.map(single_game => {
                const {
                    date,
                    is_completed,
                    is_public,
                    is_rated,
                    players,
                    result,
                    metadata: { ordered_players, map_id_to_idx }
                } = single_game;
                const team = ordered_players[map_id_to_idx[user_id]]['team'];
                const role = ordered_players[map_id_to_idx[user_id]]['role'];
                const num_players = players.length;
                return {
                    date,
                    is_completed,
                    is_public,
                    is_rated,
                    num_players,
                    team,
                    role,
                    result
                };
            });
            // Filter out to include only games that completed
            const completedGamesData = allGamesData.filter(gameObj => {
                const { is_completed } = gameObj;
                return is_completed;
            });
            res.json(completedGamesData);
        });
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

module.exports = router;

const getDataWithPaddedDates = dataOverTime => {
    // Sanity check
    if (!dataOverTime || (dataOverTime && dataOverTime.length === 0)) {
        return [];
    }
    if (dataOverTime.length === 1) {
        return dataOverTime;
    }

    // 1) Get all dates in between
    const startDate = dataOverTime[0]['Date'];
    const endDate = dataOverTime[dataOverTime.length - 1]['Date'];
    const arrInBetweenDates = getArrInBetweenDates(startDate, endDate);

    // 2) Add all the dates in between that are not in original array
    const setOfIncludedDates = new Set(dataOverTime.map(singleDayData => singleDayData.Date));
    arrInBetweenDates.forEach(inBetweenDate => {
        if (!setOfIncludedDates.has(inBetweenDate)) {
            dataOverTime.push({ Date: inBetweenDate, 'New Games': 0 });
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

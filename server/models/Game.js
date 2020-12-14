const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GameSchema = new Schema(
    {
        metadata: {
            type: Object,
            required: true
        },
        history: {
            type: Object,
            required: true
        },
        players: {
            type: Array,
            required: true
        },
        result: {
            type: Object,
            rerquired: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    { collection: 'TestGames' }
);

module.exports = Game = mongoose.model('game', GameSchema);

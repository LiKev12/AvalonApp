const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MockGameSchema = new Schema(
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
        winningTeam: {
            type: String,
            rerquired: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    { collection: 'MockGames' }
);

module.exports = MockGame = mongoose.model('mockGame', MockGameSchema);

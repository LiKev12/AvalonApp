const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GameSchema = new Schema(
    {
        room_id: {
            type: String,
            required: true
        },
        is_public: {
            type: Boolean,
            required: true
        },
        is_rated: {
            type: Boolean,
            required: true
        },
        creation_time: {
            type: Date,
            required: true
        },
        start_time: {
            type: Date,
            required: true
        },
        end_time: {
            type: Date,
            required: true
        },
        is_completed: {
            type: Boolean,
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
        metadata: {
            type: Object,
            required: true
        },
        history: {
            type: Object,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    { collection: 'Games' }
);

module.exports = Game = mongoose.model('game', GameSchema);

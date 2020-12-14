const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RoomSchema = new Schema(
    {
        date: {
            type: Date,
            default: Date.now
        },
        room_id: {
            type: String,
            required: true
        },
        is_public: {
            type: Boolean,
            required: true
        }
    },
    { collection: 'Rooms' }
);

module.exports = Room = mongoose.model('room', RoomSchema);

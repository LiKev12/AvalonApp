const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Room = require('../../models/Room');

// @route GET api/rooms
// @desc Get all rooms
// @access Public
router.get('/', (req, res) => {
    Room.find()
        .sort({ date: -1 })
        .then(rooms => {
            res.json(rooms);
        });
});

// @route POST api/rooms
// @desc Create a room
// @access Private
router.post('/', auth, (req, res) => {
    const { room_id, is_public } = req.body;
    const newRoom = new Room({
        room_id,
        is_public
    });
    Room.findOne({ room_id }).then(room => {
        if (room) {
            return res.status(400).json({ msg: 'Room already exists' });
        }
        newRoom.save().then(room => res.json(room));
    });
});

module.exports = router;

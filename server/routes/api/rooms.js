const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Room = require('../../models/Room');

// @route GET api/rooms
// @desc Get a valid room_id that is not yet taken (one that is not in the database yet)
// @access Public
router.get('/', (req, res) => {
    Room.find().then(rooms => {
        const unavailable_room_ids = rooms.map(roomObj => roomObj.room_id);
        const all_possible_room_ids = generateArrBetweenEnds(100000, 1000000);
        const available_room_ids = all_possible_room_ids.filter(room_id => !unavailable_room_ids.includes(room_id));
        const final_room_id = available_room_ids[Math.floor(Math.random() * available_room_ids.length)].toString();
        res.json(final_room_id);
    });
});

// @route POST api/rooms
// @desc Create a room
// @access Private
router.post('/', auth, (req, res) => {
    const { room_id, is_public, is_rated } = req.body;
    const newRoom = new Room({
        room_id,
        is_public,
        is_rated
    });
    Room.findOne({ room_id }).then(room => {
        if (room) {
            return res.status(400).json({ msg: 'Room already exists' });
        }
        newRoom.save().then(room => res.json(room));
    });
});

module.exports = router;

const generateArrBetweenEnds = (lower, upper) => {
    const arrBetweenEnds = [];
    for (let i = lower; i < upper; i++) {
        arrBetweenEnds.push(i.toString());
    }
    return arrBetweenEnds;
};

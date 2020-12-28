const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            default: 1500
        },
        register_date: {
            type: Date,
            default: Date.now
        }
    },
    { collection: 'Users' }
);

module.exports = User = mongoose.model('user', UserSchema);

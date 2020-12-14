const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Schema

const ItemSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
    // { collection: 'collection_name' }
);

// Name of collection is 'item'
module.exports = Item = mongoose.model('item', ItemSchema);

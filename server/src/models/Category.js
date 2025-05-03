const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    length: {
        type: String,
        enum: ['short', 'medium', 'long'],
        required: true
    },
    faceshape: {
        type: String,
        enum: ['oval', 'square', 'round'],
        required: true
    }
});

module.exports = mongoose.model('Category', categorySchema); 
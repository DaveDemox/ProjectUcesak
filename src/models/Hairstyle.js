const mongoose = require('mongoose');

const hairstyleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lengthCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    faceshapeCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    note: {
        type: String
    }
});

module.exports = mongoose.model('Hairstyle', hairstyleSchema); 
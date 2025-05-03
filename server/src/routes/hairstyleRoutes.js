const express = require('express');
const router = express.Router();
const hairstyleController = require('../controller/hairstyleController');

// Create hairstyle
router.post('/', hairstyleController.createHairstyle);

// Get all hairstyles (with optional filtering)
router.get('/', hairstyleController.listHairstyles);

// Get hairstyle by ID
router.get('/:id', hairstyleController.getHairstyle);

// Toggle like status
router.patch('/:id/like', hairstyleController.toggleLike);

module.exports = router; 
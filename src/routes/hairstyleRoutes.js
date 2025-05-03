const express = require('express');
const router = express.Router();
const HairstyleController = require('../controllers/hairstyleController');

router.post('/', HairstyleController.createHairstyle);
router.get('/', HairstyleController.getAllHairstyles);
router.get('/:id', HairstyleController.getHairstyleById);
router.patch('/:id/like', HairstyleController.toggleLike);

module.exports = router; 
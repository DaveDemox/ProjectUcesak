const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

// Create category
router.post('/', categoryController.createCategory);

// Get all categories
router.get('/', categoryController.listCategories);

// Get category by ID
router.get('/:id', categoryController.getCategory);

module.exports = router; 
const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

module.exports = router; 
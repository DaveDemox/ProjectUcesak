const express = require('express');
const router = express.Router();
const faceShapeCategoryDao = require('../dao/faceshape-category-dao');

// List face shape categories
router.get('/', async (req, res) => {
    try {
        const categories = await faceShapeCategoryDao.list();
        console.log('Face shape categories:', categories);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching face shape categories:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get face shape category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await faceShapeCategoryDao.getById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Face shape category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Error fetching face shape category:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 
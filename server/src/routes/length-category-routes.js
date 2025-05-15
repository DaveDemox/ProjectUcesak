const express = require('express');
const router = express.Router();
const lengthCategoryDao = require('../dao/length-category-dao');

// List length categories
router.get('/', async (req, res) => {
    try {
        const categories = await lengthCategoryDao.list();
        console.log('Length categories:', categories);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching length categories:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get length category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await lengthCategoryDao.getById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Length category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Error fetching length category:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 
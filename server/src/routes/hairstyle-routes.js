const express = require('express');
const router = express.Router();
const hairstyleAbl = require('../abl/hairstyle-abl');

// Create new hairstyle
router.post('/', async (req, res) => {
    try {
        const hairstyle = await hairstyleAbl.create(req.body);
        res.json(hairstyle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// List hairstyles with optional filters
router.get('/', async (req, res) => {
    try {
        const filters = {
            lengthCategoryId: req.query.lengthCategoryId,
            faceShapeCategoryId: req.query.faceShapeCategoryId
        };
        const hairstyles = await hairstyleAbl.list(filters);
        res.json({ itemList: hairstyles });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get hairstyle by ID
router.get('/:id', async (req, res) => {
    try {
        const hairstyle = await hairstyleAbl.getById(req.params.id);
        if (!hairstyle) {
            return res.status(404).json({ error: 'Hairstyle not found' });
        }
        res.json(hairstyle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const CategoryAbl = require('../abl/categoryAbl');
const validateCategory = require('../validators/categoryValidator');

router.post('/', async (req, res) => {
    try {
        if (!validateCategory(req.body)) {
            return res.status(400).json({ error: validateCategory.errors });
        }

        const category = await CategoryAbl.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        if (error.code === "uniqueNameAlreadyExists") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await CategoryAbl.list();
        res.json({ itemList: categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const category = await CategoryAbl.getById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!validateCategory(req.body)) {
            return res.status(400).json({ error: validateCategory.errors });
        }

        const category = await CategoryAbl.update(req.params.id, req.body);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const category = await CategoryAbl.delete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 
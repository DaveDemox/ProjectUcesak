const express = require('express');
const router = express.Router();
const CreateAbl = require('../abl/hairstyle/createAbl');
const ListAbl = require('../abl/hairstyle/listAbl');
const GetAbl = require('../abl/hairstyle/getAbl');
const ToggleLikeAbl = require('../abl/hairstyle/toggleLikeAbl');
const validateHairstyle = require('../validators/hairstyleValidator');
const categoryDao = require('../dao/storage/category-dao');
const CategoryAbl = require('../abl/categoryAbl');

router.post('/', CreateAbl);
router.get('/', ListAbl);
router.get('/:id', GetAbl);
router.patch('/:id/like', ToggleLikeAbl);

router.get('/list', async (req, res) => {
    try {
        const { lengthCategoryId, faceshapeCategoryId } = req.query;
        let hairstyles;
        
        if (lengthCategoryId && faceshapeCategoryId) {
            hairstyles = await ListAbl.listByCategory(lengthCategoryId, faceshapeCategoryId);
        } else if (lengthCategoryId) {
            hairstyles = await ListAbl.listByLengthCategoryId(lengthCategoryId);
        } else if (faceshapeCategoryId) {
            hairstyles = await ListAbl.listByFaceshapeCategoryId(faceshapeCategoryId);
        } else {
            hairstyles = await ListAbl.list();
        }

        const categoryMap = await CategoryAbl.getCategoryMap();
        res.json({ itemList: hairstyles, categoryMap });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!validateHairstyle(req.body)) {
            return res.status(400).json({ error: validateHairstyle.errors });
        }

        const hairstyle = await GetAbl.update(req.params.id, req.body);
        if (!hairstyle) {
            return res.status(404).json({ error: 'Hairstyle not found' });
        }
        res.json(hairstyle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const hairstyle = await GetAbl.delete(req.params.id);
        if (!hairstyle) {
            return res.status(404).json({ error: 'Hairstyle not found' });
        }
        res.json({ message: 'Hairstyle deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 
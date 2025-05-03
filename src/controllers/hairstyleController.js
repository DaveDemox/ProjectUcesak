const hairstyleDao = require('../dao/storage/hairstyle-dao');
const validateHairstyle = require('../validators/hairstyleValidator');
const categoryDao = require('../dao/storage/category-dao');

class HairstyleController {
    static async createHairstyle(req, res) {
        try {
            if (!validateHairstyle(req.body)) {
                return res.status(400).json({ error: validateHairstyle.errors });
            }

            const hairstyle = await hairstyleDao.create(req.body);
            res.status(201).json(hairstyle);
        } catch (error) {
            if (error.code === "lengthCategoryDoesNotExist" || 
                error.code === "faceshapeCategoryDoesNotExist") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllHairstyles(req, res) {
        try {
            const { lengthCategoryId, faceshapeCategoryId } = req.query;
            let hairstyles;
            
            if (lengthCategoryId && faceshapeCategoryId) {
                hairstyles = await hairstyleDao.listByCategory(lengthCategoryId, faceshapeCategoryId);
            } else if (lengthCategoryId) {
                hairstyles = await hairstyleDao.listByLengthCategoryId(lengthCategoryId);
            } else if (faceshapeCategoryId) {
                hairstyles = await hairstyleDao.listByFaceshapeCategoryId(faceshapeCategoryId);
            } else {
                hairstyles = await hairstyleDao.list();
            }

            const categoryMap = await categoryDao.getCategoryMap();
            res.json({ 
                itemList: hairstyles,
                categoryMap 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getHairstyleById(req, res) {
        try {
            const hairstyle = await hairstyleDao.getById(req.params.id);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json(hairstyle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async toggleLike(req, res) {
        try {
            const hairstyle = await hairstyleDao.toggleLike(req.params.id);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json(hairstyle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateHairstyle(req, res) {
        try {
            if (!validateHairstyle(req.body)) {
                return res.status(400).json({ error: validateHairstyle.errors });
            }

            const hairstyle = await hairstyleDao.update(req.params.id, req.body);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json(hairstyle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteHairstyle(req, res) {
        try {
            const hairstyle = await hairstyleDao.delete(req.params.id);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json({ message: 'Hairstyle deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = HairstyleController; 
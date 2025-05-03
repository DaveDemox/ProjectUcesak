const HairstyleAbl = require('../abl/hairstyleAbl');
const validateHairstyle = require('../validators/hairstyleValidator');
const categoryDao = require('../dao/storage/category-dao');
const CategoryAbl = require('../abl/categoryAbl');

const hairstyleController = {
    async createHairstyle(req, res) {
        try {
            if (!validateHairstyle(req.body)) {
                return res.status(400).json({ error: validateHairstyle.errors });
            }

            const hairstyle = await HairstyleAbl.create(req.body);
            res.status(201).json(hairstyle);
        } catch (error) {
            if (error.code === "lengthCategoryDoesNotExist" || 
                error.code === "faceshapeCategoryDoesNotExist") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    },

    async getHairstyle(req, res) {
        try {
            const hairstyle = await HairstyleAbl.getById(req.params.id);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json(hairstyle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async listHairstyles(req, res) {
        try {
            const { lengthCategoryId, faceshapeCategoryId } = req.query;
            let hairstyles;
            
            if (lengthCategoryId && faceshapeCategoryId) {
                hairstyles = await HairstyleAbl.listByCategory(lengthCategoryId, faceshapeCategoryId);
            } else if (lengthCategoryId) {
                hairstyles = await HairstyleAbl.listByLengthCategoryId(lengthCategoryId);
            } else if (faceshapeCategoryId) {
                hairstyles = await HairstyleAbl.listByFaceshapeCategoryId(faceshapeCategoryId);
            } else {
                hairstyles = await HairstyleAbl.list();
            }

            const categoryMap = await CategoryAbl.getCategoryMap();
            res.json({ itemList: hairstyles, categoryMap });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async toggleLike(req, res) {
        try {
            const hairstyle = await HairstyleAbl.toggleLike(req.params.id);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json(hairstyle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateHairstyle(req, res) {
        try {
            if (!validateHairstyle(req.body)) {
                return res.status(400).json({ error: validateHairstyle.errors });
            }

            const hairstyle = await HairstyleAbl.update(req.params.id, req.body);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json(hairstyle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteHairstyle(req, res) {
        try {
            const hairstyle = await HairstyleAbl.delete(req.params.id);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json({ message: 'Hairstyle deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = hairstyleController; 
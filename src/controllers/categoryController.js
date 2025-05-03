const categoryDao = require('../dao/storage/category-dao');
const validateCategory = require('../validators/categoryValidator');

class CategoryController {
    static async createCategory(req, res) {
        try {
            if (!validateCategory(req.body)) {
                return res.status(400).json({ error: validateCategory.errors });
            }

            const category = await categoryDao.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            if (error.code === "uniqueNameAlreadyExists") {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllCategories(req, res) {
        try {
            const categories = await categoryDao.list();
            res.json({ itemList: categories });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCategoryById(req, res) {
        try {
            const category = await categoryDao.getById(req.params.id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateCategory(req, res) {
        try {
            if (!validateCategory(req.body)) {
                return res.status(400).json({ error: validateCategory.errors });
            }

            const category = await categoryDao.update(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteCategory(req, res) {
        try {
            const category = await categoryDao.delete(req.params.id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CategoryController; 
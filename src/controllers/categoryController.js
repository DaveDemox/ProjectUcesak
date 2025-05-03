const CategoryDAO = require('../dao/categoryDAO');
const validateCategory = require('../validators/categoryValidator');

class CategoryController {
    static async createCategory(req, res) {
        try {
            if (!validateCategory(req.body)) {
                return res.status(400).json({ error: validateCategory.errors });
            }

            const category = await CategoryDAO.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllCategories(req, res) {
        try {
            const categories = await CategoryDAO.findAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCategoryById(req, res) {
        try {
            const category = await CategoryDAO.findById(req.params.id);
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

            const category = await CategoryDAO.update(req.params.id, req.body);
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
            const category = await CategoryDAO.delete(req.params.id);
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
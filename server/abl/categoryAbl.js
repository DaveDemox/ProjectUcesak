const CategoryDAO = require('../dao/storage/categoryList');
const { validateCategory } = require('../validators/categoryValidator');

class CategoryAbl {
    async create(categoryData) {
        // Validate category data
        const validationResult = validateCategory(categoryData);
        if (!validationResult.isValid) {
            throw new Error(validationResult.error);
        }

        // Create category using DAO
        return await CategoryDAO.create(categoryData);
    }

    async getById(id) {
        return await CategoryDAO.getById(id);
    }

    async list() {
        return await CategoryDAO.list();
    }

    async getCategoryMap() {
        return await CategoryDAO.getCategoryMap();
    }
}

module.exports = new CategoryAbl(); 
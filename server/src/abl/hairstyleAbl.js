const HairstyleDAO = require('../dao/storage/hairstyleList');
const CategoryAbl = require('./categoryAbl');
const { validateHairstyle } = require('../validators/hairstyleValidator');

class HairstyleAbl {
    async create(hairstyleData) {
        // Validate hairstyle data
        const validationResult = validateHairstyle(hairstyleData);
        if (!validationResult.isValid) {
            throw new Error(validationResult.error);
        }

        // Verify categories exist
        const lengthCategory = await CategoryAbl.getById(hairstyleData.lengthCategoryId);
        const faceshapeCategory = await CategoryAbl.getById(hairstyleData.faceshapeCategoryId);

        if (!lengthCategory || !faceshapeCategory) {
            throw new Error('Invalid category IDs provided');
        }

        // Create hairstyle using DAO
        return await HairstyleDAO.create(hairstyleData);
    }

    async getById(id) {
        return await HairstyleDAO.getById(id);
    }

    async listByCategory(lengthCategoryId, faceshapeCategoryId) {
        return await HairstyleDAO.listByCategory(lengthCategoryId, faceshapeCategoryId);
    }

    async listByLengthCategoryId(lengthCategoryId) {
        return await HairstyleDAO.listByLengthCategoryId(lengthCategoryId);
    }

    async listByFaceshapeCategoryId(faceshapeCategoryId) {
        return await HairstyleDAO.listByFaceshapeCategoryId(faceshapeCategoryId);
    }

    async toggleLike(id) {
        return await HairstyleDAO.toggleLike(id);
    }
}

module.exports = new HairstyleAbl(); 
const hairstyleDao = require('../dao/hairstyle-dao');
const lengthCategoryDao = require('../dao/length-category-dao');
const faceShapeCategoryDao = require('../dao/faceshape-category-dao');

class HairstyleAbl {
    async create(hairstyle) {
        // Validate required fields
        if (!hairstyle.name || !hairstyle.lengthCategoryId || !hairstyle.faceShapeCategoryId) {
            throw new Error('Missing required fields');
        }

        // Validate length category exists
        const lengthCategory = await lengthCategoryDao.getById(hairstyle.lengthCategoryId);
        if (!lengthCategory) {
            throw new Error('Invalid length category');
        }

        // Validate face shape category exists
        const faceShapeCategory = await faceShapeCategoryDao.getById(hairstyle.faceShapeCategoryId);
        if (!faceShapeCategory) {
            throw new Error('Invalid face shape category');
        }

        // Create hairstyle
        return await hairstyleDao.create(hairstyle);
    }

    async list(filters = {}) {
        const hairstyles = await hairstyleDao.list();
        
        // Apply filters
        return hairstyles.filter(hairstyle => {
            if (filters.lengthCategoryId && hairstyle.lengthCategoryId !== filters.lengthCategoryId) {
                return false;
            }
            if (filters.faceShapeCategoryId && hairstyle.faceShapeCategoryId !== filters.faceShapeCategoryId) {
                return false;
            }
            return true;
        });
    }

    async getById(id) {
        return await hairstyleDao.getById(id);
    }
}

module.exports = new HairstyleAbl(); 
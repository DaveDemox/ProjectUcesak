const Ajv = require("ajv");
const ajv = new Ajv();
const HairstyleDAO = require('../dao/storage/hairstyle-dao');
const CategoryAbl = require('./categoryAbl');

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    lengthCategoryId: { type: "string" },
    faceshapeCategoryId: { type: "string" },
    note: { type: "string" },
    isLiked: { type: "boolean" }
  },
  required: ["name", "lengthCategoryId", "faceshapeCategoryId"],
  additionalProperties: false,
};

class HairstyleAbl {
    async create(hairstyleData) {
        // Validate hairstyle data
        const valid = ajv.validate(schema, hairstyleData);
        if (!valid) {
            throw new Error(ajv.errors[0].message);
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
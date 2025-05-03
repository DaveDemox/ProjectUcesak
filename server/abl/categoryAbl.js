const Ajv = require("ajv");
const ajv = new Ajv();
const CategoryDAO = require('../dao/storage/category-dao');

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
  additionalProperties: false,
};

class CategoryAbl {
    async create(categoryData) {
        // Validate category data
        const valid = ajv.validate(schema, categoryData);
        if (!valid) {
            throw new Error(ajv.errors[0].message);
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
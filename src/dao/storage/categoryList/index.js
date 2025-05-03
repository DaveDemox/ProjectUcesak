const Category = require('../models/Category');

class CategoryDAO {
    static async create(categoryData) {
        const category = new Category(categoryData);
        return await category.save();
    }

    static async findAll() {
        return await Category.find();
    }

    static async findById(id) {
        return await Category.findById(id);
    }

    static async update(id, categoryData) {
        return await Category.findByIdAndUpdate(id, categoryData, { new: true });
    }

    static async delete(id) {
        return await Category.findByIdAndDelete(id);
    }
}

module.exports = CategoryDAO; 
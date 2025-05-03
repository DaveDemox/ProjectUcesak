const Hairstyle = require('../models/Hairstyle');

class HairstyleDAO {
    static async create(hairstyleData) {
        const hairstyle = new Hairstyle(hairstyleData);
        return await hairstyle.save();
    }

    static async findAll() {
        return await Hairstyle.find()
            .populate('lengthCategoryId')
            .populate('faceshapeCategoryId');
    }

    static async findById(id) {
        return await Hairstyle.findById(id)
            .populate('lengthCategoryId')
            .populate('faceshapeCategoryId');
    }

    static async update(id, hairstyleData) {
        return await Hairstyle.findByIdAndUpdate(id, hairstyleData, { new: true })
            .populate('lengthCategoryId')
            .populate('faceshapeCategoryId');
    }

    static async delete(id) {
        return await Hairstyle.findByIdAndDelete(id);
    }
}

module.exports = HairstyleDAO; 
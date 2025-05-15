const hairstyleDao = require('../../dao/storage/hairstyle-dao');
const lengthCategoryDao = require('../../dao/storage/length-category-dao');
const faceshapeCategoryDao = require('../../dao/storage/faceshape-category-dao');

async function UpdateAbl(req, res) {
    try {
        const hairstyle = await hairstyleDao.getById(req.params.id);
        if (!hairstyle) {
            res.status(404).json({
                code: "hairstyleNotFound",
                message: "Hairstyle not found"
            });
            return;
        }

        // Validate referenced categories
        const lengthCategory = lengthCategoryDao.getById(hairstyle.lengthCategoryId);
        const faceshapeCategory = faceshapeCategoryDao.getById(hairstyle.faceshapeCategoryId);
        if (!lengthCategory) {
            res.status(400).json({ code: "lengthCategoryNotFound", message: "Length category not found" });
            return;
        }
        if (!faceshapeCategory) {
            res.status(400).json({ code: "faceshapeCategoryNotFound", message: "Faceshape category not found" });
            return;
        }

        const updatedHairstyle = await hairstyleDao.update({
            id: req.params.id,
            ...req.body
        });

        res.json(updatedHairstyle);
    } catch (error) {
        res.status(500).json({
            code: "failedToUpdateHairstyle",
            message: error.message
        });
    }
}

module.exports = UpdateAbl; 
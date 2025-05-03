const hairstyleDao = require('../../dao/storage/hairstyle-dao');
const categoryDao = require('../../dao/storage/category-dao');

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

        // Validate categories exist if being updated
        if (req.body.lengthCategoryId) {
            const lengthCategory = await categoryDao.getById(req.body.lengthCategoryId);
            if (!lengthCategory) {
                res.status(404).json({
                    code: "lengthCategoryNotFound",
                    message: "Length category not found"
                });
                return;
            }
        }
        if (req.body.faceshapeCategoryId) {
            const faceshapeCategory = await categoryDao.getById(req.body.faceshapeCategoryId);
            if (!faceshapeCategory) {
                res.status(404).json({
                    code: "faceshapeCategoryNotFound",
                    message: "Face shape category not found"
                });
                return;
            }
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
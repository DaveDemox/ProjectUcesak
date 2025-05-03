const hairstyleDao = require('../../dao/storage/hairstyle-dao');

async function DeleteAbl(req, res) {
    try {
        const hairstyle = await hairstyleDao.getById(req.params.id);
        if (!hairstyle) {
            res.status(404).json({
                code: "hairstyleNotFound",
                message: "Hairstyle not found"
            });
            return;
        }

        await hairstyleDao.remove(req.params.id);
        res.json({ message: "Hairstyle deleted successfully" });
    } catch (error) {
        res.status(500).json({
            code: "failedToDeleteHairstyle",
            message: error.message
        });
    }
}

module.exports = DeleteAbl; 
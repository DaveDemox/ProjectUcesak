const categoryDao = require("../../dao/storage/category-dao");

async function DeleteAbl(req, res) {
  try {
    const categoryId = req.params.id;
    const category = await categoryDao.delete(categoryId);
    
    if (!category) {
      res.status(404).json({
        code: "categoryNotFound",
        message: "Category not found",
      });
      return;
    }

    res.json({ message: "Category deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl; 
const categoryDao = require("../../dao/storage/category-dao");

async function GetAbl(req, res) {
  try {
    const category = await categoryDao.getById(req.params.id);
    if (!category) {
      res.status(404).json({
        code: "categoryNotFound",
        message: "Category not found",
      });
      return;
    }
    res.json(category);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl; 
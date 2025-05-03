const categoryDao = require("../../dao/storage/category-dao");

async function ListAbl(req, res) {
  try {
    const categories = await categoryDao.list();
    res.json({ itemList: categories });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl; 
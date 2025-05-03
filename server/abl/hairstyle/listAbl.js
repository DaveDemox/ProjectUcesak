const hairstyleDao = require("../../dao/storage/hairstyle-dao");
const categoryDao = require("../../dao/storage/category-dao");

async function ListAbl(req, res) {
  try {
    const { lengthCategoryId, faceshapeCategoryId } = req.query;
    let hairstyles;
    
    if (lengthCategoryId && faceshapeCategoryId) {
      hairstyles = await hairstyleDao.listByCategory(lengthCategoryId, faceshapeCategoryId);
    } else if (lengthCategoryId) {
      hairstyles = await hairstyleDao.listByLengthCategoryId(lengthCategoryId);
    } else if (faceshapeCategoryId) {
      hairstyles = await hairstyleDao.listByFaceshapeCategoryId(faceshapeCategoryId);
    } else {
      hairstyles = await hairstyleDao.list();
    }

    const categoryMap = await categoryDao.getCategoryMap();
    res.json({ itemList: hairstyles, categoryMap });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl; 
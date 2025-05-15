const hairstyleDao = require("../../dao/storage/hairstyle-dao");
const lengthCategoryDao = require("../../dao/storage/length-category-dao");
const faceshapeCategoryDao = require("../../dao/storage/faceshape-category-dao");

async function ListAbl(req, res) {
  try {
    const { lengthCategoryId, faceshapeCategoryId } = req.query;
    let hairstyles;
    
    if (lengthCategoryId && faceshapeCategoryId) {
      hairstyles = hairstyleDao.listByCategory(lengthCategoryId, faceshapeCategoryId);
    } else if (lengthCategoryId) {
      hairstyles = hairstyleDao.listByLengthCategoryId(lengthCategoryId);
    } else if (faceshapeCategoryId) {
      hairstyles = hairstyleDao.listByFaceshapeCategoryId(faceshapeCategoryId);
    } else {
      hairstyles = hairstyleDao.list();
    }

    // Provide both category lists for the frontend
    const lengthCategories = lengthCategoryDao.list();
    const faceshapeCategories = faceshapeCategoryDao.list();
    res.json({ itemList: hairstyles, lengthCategories, faceshapeCategories });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl; 
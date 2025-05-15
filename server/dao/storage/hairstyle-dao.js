const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const lengthCategoryDao = require("./length-category-dao");
const faceshapeCategoryDao = require("./faceshape-category-dao");
const { v4: uuidv4 } = require('uuid');

const hairstyleFolderPath = path.join(__dirname, "hairstyleList");

// Method to read a hairstyle from a file
function getById(id) {
  try {
    const filePath = path.join(hairstyleFolderPath, `${id}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    const hairstyle = JSON.parse(fileData);
    hairstyle.lengthCategory = lengthCategoryDao.getById(hairstyle.lengthCategoryId);
    hairstyle.faceshapeCategory = faceshapeCategoryDao.getById(hairstyle.faceshapeCategoryId);
    return hairstyle;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadHairstyle", message: error.message };
  }
}

// Method to write a hairstyle to a file
function create(hairstyle) {
  try {
    // Validate referenced categories
    const lengthCategory = lengthCategoryDao.getById(hairstyle.lengthCategoryId);
    const faceshapeCategory = faceshapeCategoryDao.getById(hairstyle.faceshapeCategoryId);
    if (!lengthCategory) {
      throw { code: "lengthCategoryNotFound", message: "Length category not found" };
    }
    if (!faceshapeCategory) {
      throw { code: "faceshapeCategoryNotFound", message: "Faceshape category not found" };
    }
    const filePath = path.join(hairstyleFolderPath, `${hairstyle.id}.json`);
    const fileData = JSON.stringify(hairstyle, null, 2);
    fs.writeFileSync(filePath, fileData, "utf8");
    return hairstyle;
  } catch (error) {
    throw { code: "failedToCreateHairstyle", message: error.message };
  }
}

// Method to update hairstyle in a file
function update(hairstyle) {
  try {
    const currentHairstyle = getById(hairstyle.id);
    if (!currentHairstyle) return null;
    // Validate referenced categories
    const lengthCategory = lengthCategoryDao.getById(hairstyle.lengthCategoryId);
    const faceshapeCategory = faceshapeCategoryDao.getById(hairstyle.faceshapeCategoryId);
    if (!lengthCategory) {
      throw { code: "lengthCategoryNotFound", message: "Length category not found" };
    }
    if (!faceshapeCategory) {
      throw { code: "faceshapeCategoryNotFound", message: "Faceshape category not found" };
    }
    const newHairstyle = { ...currentHairstyle, ...hairstyle };
    const filePath = path.join(hairstyleFolderPath, `${hairstyle.id}.json`);
    const fileData = JSON.stringify(newHairstyle, null, 2);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newHairstyle;
  } catch (error) {
    throw { code: "failedToUpdateHairstyle", message: error.message };
  }
}

// Method to remove a hairstyle from a file
function remove(hairstyleId) {
  try {
    const filePath = path.join(hairstyleFolderPath, `${hairstyleId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveHairstyle", message: error.message };
  }
}

// Method to list all hairstyles
function list() {
  try {
    const files = fs.readdirSync(hairstyleFolderPath);
    return files.map((file) => {
      const fileData = fs.readFileSync(path.join(hairstyleFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
  } catch (error) {
    throw { code: "failedToListHairstyles", message: error.message };
  }
}

// Method to list hairstyles by both length and faceshape categories
function listByCategory(lengthCategoryId, faceshapeCategoryId) {
  return list().filter(
    (h) =>
      h.lengthCategoryId === lengthCategoryId &&
      h.faceshapeCategoryId === faceshapeCategoryId
  );
}

// Method to list hairstyles by length category
function listByLengthCategoryId(lengthCategoryId) {
  return list().filter((h) => h.lengthCategoryId === lengthCategoryId);
}

// Method to list hairstyles by faceshape category
function listByFaceshapeCategoryId(faceshapeCategoryId) {
  return list().filter((h) => h.faceshapeCategoryId === faceshapeCategoryId);
}

// Method to toggle like status of a hairstyle
function toggleLike(id) {
  try {
    const hairstyle = getById(id);
    if (!hairstyle) return null;
    hairstyle.isLiked = !hairstyle.isLiked;
    const filePath = path.join(hairstyleFolderPath, `${id}.json`);
    const fileData = JSON.stringify(hairstyle, null, 2);
    fs.writeFileSync(filePath, fileData, "utf8");
    return hairstyle;
  } catch (error) {
    throw { code: "failedToToggleLike", message: error.message };
  }
}

module.exports = {
  getById,
  list,
  listByLengthCategoryId,
  listByFaceshapeCategoryId,
  listByCategory,
  create,
  update,
  remove,
  toggleLike,
}; 
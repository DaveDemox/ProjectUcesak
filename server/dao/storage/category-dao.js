const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const categoryFolderPath = path.join(__dirname, "categoryList");

// Valid length types
const VALID_LENGTHS = ["short", "medium", "long"];
// Valid faceshape types
const VALID_FACESHAPES = ["oval", "square", "round"];

// Method to read a category from a file
function getById(id) {
  try {
    const filePath = path.join(categoryFolderPath, `${id}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadCategory", message: error.message };
  }
}

// Method to write a category to a file
function create(categoryData) {
  try {
    // Validate category properties
    if (!categoryData.name) {
      throw { code: "invalidCategory", message: "Category name is required" };
    }
    if (!VALID_LENGTHS.includes(categoryData.length)) {
      throw { code: "invalidCategory", message: "Invalid length type" };
    }
    if (!VALID_FACESHAPES.includes(categoryData.faceshape)) {
      throw { code: "invalidCategory", message: "Invalid faceshape type" };
    }

    // Check for unique name
    const categories = list();
    if (categories.some(cat => cat.name === categoryData.name)) {
      throw { code: "uniqueNameAlreadyExists", message: "Category name must be unique" };
    }

    const category = {
      ...categoryData,
      id: crypto.randomBytes(16).toString("hex")
    };
    
    const filePath = path.join(categoryFolderPath, `${category.id}.json`);
    const fileData = JSON.stringify(category, null, 2);
    fs.writeFileSync(filePath, fileData, "utf8");
    return category;
  } catch (error) {
    throw { code: "failedToCreateCategory", message: error.message };
  }
}

// Method to update category in a file
function update(category) {
  try {
    const currentCategory = getById(category.id);
    if (!currentCategory) return null;

    if (category.name && category.name !== currentCategory.name) {
      const categoryList = list();
      if (categoryList.some((item) => item.name === category.name)) {
        throw {
          code: "uniqueNameAlreadyExists",
          message: "exists category with given name",
        };
      }
    }

    const newCategory = { ...currentCategory, ...category };
    const filePath = path.join(categoryFolderPath, `${category.id}.json`);
    const fileData = JSON.stringify(newCategory, null, 2);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newCategory;
  } catch (error) {
    throw { code: "failedToUpdateCategory", message: error.message };
  }
}

// Method to remove a category from a file
function remove(categoryId) {
  try {
    const filePath = path.join(categoryFolderPath, `${categoryId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveCategory", message: error.message };
  }
}

// Method to list all categories
function list() {
  try {
    const files = fs.readdirSync(categoryFolderPath);
    return files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(categoryFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
  } catch (error) {
    throw { code: "failedToListCategories", message: error.message };
  }
}

// Method to get a map of all categories
function getCategoryMap() {
  try {
    const categories = list();
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.id] = category;
    });
    return categoryMap;
  } catch (error) {
    throw { code: "failedToGetCategoryMap", message: error.message };
  }
}

module.exports = {
  getById,
  create,
  update,
  remove,
  list,
  getCategoryMap,
}; 
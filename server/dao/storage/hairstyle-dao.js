const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const categoryDao = require("./category-dao");
const { v4: uuidv4 } = require('uuid');

const hairstyleFolderPath = path.join(__dirname, "hairstyleList");

// Method to read a hairstyle from a file
async function getById(id) {
  try {
    const filePath = path.join(hairstyleFolderPath, `${id}.json`);
    const fileData = await fs.readFile(filePath, "utf8");
    const hairstyle = JSON.parse(fileData);
    // Populate category data
    if (hairstyle.lengthCategoryId) {
      hairstyle.lengthCategory = await categoryDao.getById(hairstyle.lengthCategoryId);
    }
    if (hairstyle.faceshapeCategoryId) {
      hairstyle.faceshapeCategory = await categoryDao.getById(hairstyle.faceshapeCategoryId);
    }
    return hairstyle;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(`Error reading hairstyle: ${error.message}`);
  }
}

// Method to write a hairstyle to a file
async function create(hairstyleData) {
  try {
    const id = uuidv4();
    const hairstyle = { ...hairstyleData, id };
    await fs.writeFile(
      path.join(hairstyleFolderPath, `${id}.json`),
      JSON.stringify(hairstyle, null, 2)
    );
    return hairstyle;
  } catch (error) {
    throw new Error(`Error creating hairstyle: ${error.message}`);
  }
}

// Method to update hairstyle in a file
async function update(hairstyle) {
  try {
    const currentHairstyle = await getById(hairstyle.id);
    if (!currentHairstyle) return null;

    // Validate categories exist if being updated
    if (hairstyle.lengthCategoryId) {
      const lengthCategory = await categoryDao.getById(hairstyle.lengthCategoryId);
      if (!lengthCategory) {
        throw {
          code: "categoryNotFound",
          message: "Length category does not exist",
        };
      }
    }
    if (hairstyle.faceshapeCategoryId) {
      const faceshapeCategory = await categoryDao.getById(hairstyle.faceshapeCategoryId);
      if (!faceshapeCategory) {
        throw {
          code: "categoryNotFound",
          message: "Face shape category does not exist",
        };
      }
    }

    const newHairstyle = { ...currentHairstyle, ...hairstyle };
    const filePath = path.join(hairstyleFolderPath, `${hairstyle.id}.json`);
    const fileData = JSON.stringify(newHairstyle, null, 2);
    await fs.writeFile(filePath, fileData, "utf8");
    return newHairstyle;
  } catch (error) {
    throw { code: "failedToUpdateHairstyle", message: error.message };
  }
}

// Method to remove a hairstyle from a file
async function remove(hairstyleId) {
  try {
    const filePath = path.join(hairstyleFolderPath, `${hairstyleId}.json`);
    await fs.unlink(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveHairstyle", message: error.message };
  }
}

// Method to list all hairstyles
async function list() {
  try {
    const files = await fs.readdir(hairstyleFolderPath);
    const hairstyleList = await Promise.all(
      files.map(async (file) => {
        const fileData = await fs.readFile(
          path.join(hairstyleFolderPath, file),
          "utf8"
        );
        const hairstyle = JSON.parse(fileData);
        // Populate category data
        if (hairstyle.lengthCategoryId) {
          hairstyle.lengthCategory = await categoryDao.getById(hairstyle.lengthCategoryId);
        }
        if (hairstyle.faceshapeCategoryId) {
          hairstyle.faceshapeCategory = await categoryDao.getById(hairstyle.faceshapeCategoryId);
        }
        return hairstyle;
      })
    );
    return hairstyleList;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw new Error(`Error listing hairstyles: ${error.message}`);
  }
}

// Method to list hairstyles by both length and faceshape categories
async function listByCategory(lengthCategoryId, faceshapeCategoryId) {
  try {
    const hairstyles = await list();
    return hairstyles.filter(hairstyle => 
      hairstyle.lengthCategoryId === lengthCategoryId && 
      hairstyle.faceshapeCategoryId === faceshapeCategoryId
    );
  } catch (error) {
    throw { code: "failedToListHairstylesByCategory", message: error.message };
  }
}

// Method to list hairstyles by length category
async function listByLengthCategoryId(lengthCategoryId) {
  try {
    const hairstyles = await list();
    return hairstyles.filter(hairstyle => 
      hairstyle.lengthCategoryId === lengthCategoryId
    );
  } catch (error) {
    throw { code: "failedToListHairstylesByLength", message: error.message };
  }
}

// Method to list hairstyles by faceshape category
async function listByFaceshapeCategoryId(faceshapeCategoryId) {
  try {
    const hairstyles = await list();
    return hairstyles.filter(hairstyle => 
      hairstyle.faceshapeCategoryId === faceshapeCategoryId
    );
  } catch (error) {
    throw { code: "failedToListHairstylesByFaceshape", message: error.message };
  }
}

// Method to toggle like status of a hairstyle
async function toggleLike(id) {
  try {
    const hairstyle = await getById(id);
    if (!hairstyle) {
      return null;
    }

    // Toggle the isLiked value
    hairstyle.isLiked = !hairstyle.isLiked;

    // Save the updated hairstyle
    const filePath = path.join(hairstyleFolderPath, `${id}.json`);
    const fileData = JSON.stringify(hairstyle, null, 2);
    await fs.writeFile(filePath, fileData, "utf8");

    return hairstyle;
  } catch (error) {
    throw new Error(`Error toggling like: ${error.message}`);
  }
}

module.exports = {
  getById,
  create,
  update,
  remove,
  list,
  listByCategory,
  listByLengthCategoryId,
  listByFaceshapeCategoryId,
  toggleLike
}; 
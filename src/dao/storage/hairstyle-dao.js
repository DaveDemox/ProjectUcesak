const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const categoryDao = require("./category-dao");

const hairstyleFolderPath = path.join(__dirname, "hairstyleList");

// Method to read a hairstyle from a file
function getById(id) {
  try {
    const filePath = path.join(hairstyleFolderPath, `${id}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    const hairstyle = JSON.parse(fileData);
    // Populate category data
    if (hairstyle.lengthCategoryId) {
      hairstyle.lengthCategory = categoryDao.getById(hairstyle.lengthCategoryId);
    }
    if (hairstyle.faceshapeCategoryId) {
      hairstyle.faceshapeCategory = categoryDao.getById(hairstyle.faceshapeCategoryId);
    }
    return hairstyle;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadHairstyle", message: error.message };
  }
}

// Method to write a hairstyle to a file
function create(hairstyleData) {
  try {
    // Validate categories exist
    if (hairstyleData.lengthCategoryId) {
      const lengthCategory = categoryDao.getById(hairstyleData.lengthCategoryId);
      if (!lengthCategory) {
        throw {
          code: "lengthCategoryDoesNotExist",
          message: "category with id dtoIn.lengthCategoryId does not exist",
        };
      }
    }
    if (hairstyleData.faceshapeCategoryId) {
      const faceshapeCategory = categoryDao.getById(hairstyleData.faceshapeCategoryId);
      if (!faceshapeCategory) {
        throw {
          code: "faceshapeCategoryDoesNotExist",
          message: "category with id dtoIn.faceshapeCategoryId does not exist",
        };
      }
    }

    const hairstyle = {
      ...hairstyleData,
      id: crypto.randomBytes(16).toString("hex")
    };
    
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

    // Validate categories exist if being updated
    if (hairstyle.lengthCategoryId) {
      const lengthCategory = categoryDao.getById(hairstyle.lengthCategoryId);
      if (!lengthCategory) {
        throw {
          code: "categoryNotFound",
          message: "Length category does not exist",
        };
      }
    }
    if (hairstyle.faceshapeCategoryId) {
      const faceshapeCategory = categoryDao.getById(hairstyle.faceshapeCategoryId);
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
    const hairstyleList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(hairstyleFolderPath, file),
        "utf8"
      );
      const hairstyle = JSON.parse(fileData);
      // Populate category data
      if (hairstyle.lengthCategoryId) {
        hairstyle.lengthCategory = categoryDao.getById(hairstyle.lengthCategoryId);
      }
      if (hairstyle.faceshapeCategoryId) {
        hairstyle.faceshapeCategory = categoryDao.getById(hairstyle.faceshapeCategoryId);
      }
      return hairstyle;
    });
    return hairstyleList;
  } catch (error) {
    throw { code: "failedToListHairstyles", message: error.message };
  }
}

// Method to list hairstyles by both length and faceshape categories
function listByCategory(lengthCategoryId, faceshapeCategoryId) {
  try {
    const hairstyles = list();
    return hairstyles.filter(hairstyle => 
      hairstyle.lengthCategoryId === lengthCategoryId && 
      hairstyle.faceshapeCategoryId === faceshapeCategoryId
    );
  } catch (error) {
    throw { code: "failedToListHairstylesByCategory", message: error.message };
  }
}

// Method to list hairstyles by length category
function listByLengthCategoryId(lengthCategoryId) {
  try {
    const hairstyles = list();
    return hairstyles.filter(hairstyle => 
      hairstyle.lengthCategoryId === lengthCategoryId
    );
  } catch (error) {
    throw { code: "failedToListHairstylesByLength", message: error.message };
  }
}

// Method to list hairstyles by faceshape category
function listByFaceshapeCategoryId(faceshapeCategoryId) {
  try {
    const hairstyles = list();
    return hairstyles.filter(hairstyle => 
      hairstyle.faceshapeCategoryId === faceshapeCategoryId
    );
  } catch (error) {
    throw { code: "failedToListHairstylesByFaceshape", message: error.message };
  }
}

// Method to toggle like status of a hairstyle
function toggleLike(id) {
  try {
    const hairstyle = getById(id);
    if (!hairstyle) {
      return null;
    }

    // Toggle the isLiked value
    hairstyle.isLiked = !hairstyle.isLiked;

    // Save the updated hairstyle
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
  create,
  update,
  remove,
  list,
  listByCategory,
  listByLengthCategoryId,
  listByFaceshapeCategoryId,
  toggleLike
}; 
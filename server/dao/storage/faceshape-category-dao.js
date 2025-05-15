const fs = require('fs');
const path = require('path');

const faceshapeCategoryFolderPath = path.join(__dirname, 'faceshapeCategoryList');

function list() {
  try {
    const files = fs.readdirSync(faceshapeCategoryFolderPath);
    return files.map((file) => {
      const fileData = fs.readFileSync(path.join(faceshapeCategoryFolderPath, file), 'utf8');
      return JSON.parse(fileData);
    });
  } catch (error) {
    throw { code: 'failedToListFaceshapeCategories', message: error.message };
  }
}

function getById(id) {
  try {
    const filePath = path.join(faceshapeCategoryFolderPath, `${id}.json`);
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw { code: 'failedToReadFaceshapeCategory', message: error.message };
  }
}

module.exports = { list, getById }; 
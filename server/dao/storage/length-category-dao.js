const fs = require('fs');
const path = require('path');

const lengthCategoryFolderPath = path.join(__dirname, 'lengthCategoryList');

function list() {
  try {
    const files = fs.readdirSync(lengthCategoryFolderPath);
    return files.map((file) => {
      const fileData = fs.readFileSync(path.join(lengthCategoryFolderPath, file), 'utf8');
      return JSON.parse(fileData);
    });
  } catch (error) {
    throw { code: 'failedToListLengthCategories', message: error.message };
  }
}

function getById(id) {
  try {
    const filePath = path.join(lengthCategoryFolderPath, `${id}.json`);
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw { code: 'failedToReadLengthCategory', message: error.message };
  }
}

module.exports = { list, getById }; 
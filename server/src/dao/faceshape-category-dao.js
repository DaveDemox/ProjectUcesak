const fs = require('fs').promises;
const path = require('path');

const FACESHAPE_CATEGORY_LIST_PATH = path.join(__dirname, 'storage', 'faceShapeCategoryList');

// Ensure storage directory exists
async function ensureStorageExists() {
    try {
        await fs.access(FACESHAPE_CATEGORY_LIST_PATH);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.mkdir(FACESHAPE_CATEGORY_LIST_PATH, { recursive: true });
        } else {
            throw error;
        }
    }
}

class FaceShapeCategoryDao {
    async list() {
        await ensureStorageExists();
        
        try {
            const files = await fs.readdir(FACESHAPE_CATEGORY_LIST_PATH);
            const categories = await Promise.all(
                files.map(async (file) => {
                    const content = await fs.readFile(path.join(FACESHAPE_CATEGORY_LIST_PATH, file), 'utf8');
                    return JSON.parse(content);
                })
            );
            return categories;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    async getById(id) {
        await ensureStorageExists();
        
        try {
            const content = await fs.readFile(path.join(FACESHAPE_CATEGORY_LIST_PATH, `${id}.json`), 'utf8');
            return JSON.parse(content);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }
}

module.exports = new FaceShapeCategoryDao(); 
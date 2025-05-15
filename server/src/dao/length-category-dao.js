const fs = require('fs').promises;
const path = require('path');

const LENGTH_CATEGORY_LIST_PATH = path.join(__dirname, 'storage', 'lengthCategoryList');

// Ensure storage directory exists
async function ensureStorageExists() {
    try {
        await fs.access(LENGTH_CATEGORY_LIST_PATH);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.mkdir(LENGTH_CATEGORY_LIST_PATH, { recursive: true });
        } else {
            throw error;
        }
    }
}

class LengthCategoryDao {
    async list() {
        await ensureStorageExists();
        
        try {
            const files = await fs.readdir(LENGTH_CATEGORY_LIST_PATH);
            const categories = await Promise.all(
                files.map(async (file) => {
                    const content = await fs.readFile(path.join(LENGTH_CATEGORY_LIST_PATH, file), 'utf8');
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
            const content = await fs.readFile(path.join(LENGTH_CATEGORY_LIST_PATH, `${id}.json`), 'utf8');
            return JSON.parse(content);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }
}

module.exports = new LengthCategoryDao(); 
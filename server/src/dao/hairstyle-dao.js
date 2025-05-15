const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const HAIRSTYLE_LIST_PATH = path.join(__dirname, 'storage', 'hairstyleList');

// Ensure storage directory exists
async function ensureStorageExists() {
    try {
        await fs.access(HAIRSTYLE_LIST_PATH);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.mkdir(HAIRSTYLE_LIST_PATH, { recursive: true });
        } else {
            throw error;
        }
    }
}

class HairstyleDao {
    async create(hairstyle) {
        await ensureStorageExists();
        
        const id = uuidv4();
        const newHairstyle = {
            id,
            ...hairstyle,
            isLiked: typeof hairstyle.isLiked === 'boolean' ? hairstyle.isLiked : undefined,
            createdAt: new Date().toISOString()
        };

        const filePath = path.join(HAIRSTYLE_LIST_PATH, `${id}.json`);
        await fs.writeFile(filePath, JSON.stringify(newHairstyle, null, 2));
        
        return newHairstyle;
    }

    async list() {
        await ensureStorageExists();
        
        try {
            const files = await fs.readdir(HAIRSTYLE_LIST_PATH);
            const hairstyles = await Promise.all(
                files.map(async (file) => {
                    const content = await fs.readFile(path.join(HAIRSTYLE_LIST_PATH, file), 'utf8');
                    return JSON.parse(content);
                })
            );
            return hairstyles;
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
            const content = await fs.readFile(path.join(HAIRSTYLE_LIST_PATH, `${id}.json`), 'utf8');
            return JSON.parse(content);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }

    async updateIsLiked(id, isLiked) {
        await ensureStorageExists();
        const filePath = path.join(HAIRSTYLE_LIST_PATH, `${id}.json`);
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const hairstyle = JSON.parse(content);
            hairstyle.isLiked = isLiked;
            await fs.writeFile(filePath, JSON.stringify(hairstyle, null, 2));
            return hairstyle;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }
}

module.exports = new HairstyleDao(); 
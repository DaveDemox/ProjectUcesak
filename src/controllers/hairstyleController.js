const HairstyleDAO = require('../dao/hairstyleDAO');
const validateHairstyle = require('../validators/hairstyleValidator');

class HairstyleController {
    static async createHairstyle(req, res) {
        try {
            if (!validateHairstyle(req.body)) {
                return res.status(400).json({ error: validateHairstyle.errors });
            }

            const hairstyle = await HairstyleDAO.create(req.body);
            res.status(201).json(hairstyle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllHairstyles(req, res) {
        try {
            const hairstyles = await HairstyleDAO.findAll();
            res.json(hairstyles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getHairstyleById(req, res) {
        try {
            const hairstyle = await HairstyleDAO.findById(req.params.id);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json(hairstyle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateHairstyle(req, res) {
        try {
            if (!validateHairstyle(req.body)) {
                return res.status(400).json({ error: validateHairstyle.errors });
            }

            const hairstyle = await HairstyleDAO.update(req.params.id, req.body);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json(hairstyle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteHairstyle(req, res) {
        try {
            const hairstyle = await HairstyleDAO.delete(req.params.id);
            if (!hairstyle) {
                return res.status(404).json({ error: 'Hairstyle not found' });
            }
            res.json({ message: 'Hairstyle deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = HairstyleController; 
const express = require('express');
const router = express.Router();
const hairstyleAbl = require('../abl/hairstyle-abl');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../dao/storage/hairstyleImages'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Create new hairstyle (with image upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let hairstyleData = req.body;
    if (req.file) {
      hairstyleData.imageUrl = `/images/${req.file.filename}`;
    }
    const hairstyle = await hairstyleAbl.create(hairstyleData);
    res.json(hairstyle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List hairstyles with optional filters
router.get('/', async (req, res) => {
    try {
        const filters = {
            lengthCategoryId: req.query.lengthCategoryId,
            faceShapeCategoryId: req.query.faceShapeCategoryId
        };
        const hairstyles = await hairstyleAbl.list(filters);
        res.json({ itemList: hairstyles });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get hairstyle by ID
router.get('/:id', async (req, res) => {
    try {
        const hairstyle = await hairstyleAbl.getById(req.params.id);
        if (!hairstyle) {
            return res.status(404).json({ error: 'Hairstyle not found' });
        }
        res.json(hairstyle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH /:id/like - update isLiked property
router.patch('/:id/like', async (req, res) => {
    try {
        const { isLiked } = req.body;
        if (typeof isLiked !== 'boolean') {
            return res.status(400).json({ error: 'isLiked must be a boolean' });
        }
        const hairstyle = await hairstyleAbl.updateIsLiked(req.params.id, isLiked);
        res.json(hairstyle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 
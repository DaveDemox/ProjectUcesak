const express = require('express');
const router = express.Router();

const GetAbl = require('../abl/hairstyle/getAbl');
const ListAbl = require('../abl/hairstyle/listAbl');
const CreateAbl = require('../abl/hairstyle/createAbl');
const ToggleLikeAbl = require('../abl/hairstyle/toggleLikeAbl');
const UpdateAbl = require('../abl/hairstyle/updateAbl');
const DeleteAbl = require('../abl/hairstyle/deleteAbl');
const lengthCategoryDao = require("../dao/storage/length-category-dao");
const faceshapeCategoryDao = require("../dao/storage/faceshape-category-dao");

router.get('/length-categories', (req, res) => {
  res.json(lengthCategoryDao.list());
});

router.get('/faceshape-categories', (req, res) => {
  res.json(faceshapeCategoryDao.list());
});

router.get('/:id', GetAbl);
router.get('/', ListAbl);
router.post('/', CreateAbl);
router.put('/:id', UpdateAbl);
router.delete('/:id', DeleteAbl);
router.patch('/:id/like', ToggleLikeAbl);

module.exports = router; 
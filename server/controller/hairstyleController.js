const express = require('express');
const router = express.Router();

const GetAbl = require('../abl/hairstyle/getAbl');
const ListAbl = require('../abl/hairstyle/listAbl');
const CreateAbl = require('../abl/hairstyle/createAbl');
const ToggleLikeAbl = require('../abl/hairstyle/toggleLikeAbl');

router.get('/:id', GetAbl);
router.get('/', ListAbl);
router.post('/', CreateAbl);
router.patch('/:id/like', ToggleLikeAbl);

module.exports = router; 
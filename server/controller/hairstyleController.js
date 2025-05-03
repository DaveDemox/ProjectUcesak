const express = require('express');
const router = express.Router();

const GetAbl = require('../abl/hairstyle/getAbl');
const ListAbl = require('../abl/hairstyle/listAbl');
const CreateAbl = require('../abl/hairstyle/createAbl');
const ToggleLikeAbl = require('../abl/hairstyle/toggleLikeAbl');
const UpdateAbl = require('../abl/hairstyle/updateAbl');
const DeleteAbl = require('../abl/hairstyle/deleteAbl');

router.get('/:id', GetAbl);
router.get('/', ListAbl);
router.post('/', CreateAbl);
router.put('/:id', UpdateAbl);
router.delete('/:id', DeleteAbl);
router.patch('/:id/like', ToggleLikeAbl);

module.exports = router; 
const express = require('express');
const router = express.Router();

const GetAbl = require('../abl/category/getAbl');
const ListAbl = require('../abl/category/listAbl');
const CreateAbl = require('../abl/category/createAbl');
const UpdateAbl = require('../abl/category/updateAbl');
const DeleteAbl = require('../abl/category/deleteAbl');

router.get('/:id', GetAbl);
router.get('/', ListAbl);
router.post('/', CreateAbl);
router.put('/:id', UpdateAbl);
router.delete('/:id', DeleteAbl);

module.exports = router; 
const Ajv = require("ajv");
const ajv = new Ajv();
const categoryDao = require("../../dao/storage/category-dao");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    // get request params
    const reqParams = { id: req.params.id };

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read category by given id
    const category = await categoryDao.getById(reqParams.id);
    if (!category) {
      res.status(404).json({
        code: "categoryNotFound",
        message: `Category with id ${reqParams.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(category);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl; 
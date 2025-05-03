const Ajv = require("ajv");
const ajv = new Ajv();

const categoryDao = require("../../dao/storage/category-dao");

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let category = req.body;

    // validate input
    const valid = ajv.validate(schema, category);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Input is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // store category to a persistant storage
    try {
      category = await categoryDao.create(category);
    } catch (e) {
      if (e.code === "uniqueNameAlreadyExists") {
        res.status(400).json({
          code: e.code,
          message: e.message,
        });
        return;
      }
      throw e;
    }

    // return properly filled dtoOut
    res.json(category);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl; 
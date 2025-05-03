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

async function UpdateAbl(req, res) {
  try {
    let category = req.body;
    const categoryId = req.params.id;

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

    // update category in storage
    try {
      category = await categoryDao.update(categoryId, category);
      if (!category) {
        res.status(404).json({
          code: "categoryNotFound",
          message: "Category not found",
        });
        return;
      }
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

    res.json(category);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl; 
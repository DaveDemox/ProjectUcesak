const Ajv = require("ajv");
const ajv = new Ajv();

const hairstyleDao = require("../../dao/storage/hairstyle-dao");
const categoryDao = require("../../dao/storage/category-dao");

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    lengthCategoryId: { type: "string" },
    faceshapeCategoryId: { type: "string" },
    note: { type: "string" },
    isLiked: { type: "boolean" }
  },
  required: ["name", "lengthCategoryId", "faceshapeCategoryId"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let hairstyle = req.body;

    // validate input
    const valid = ajv.validate(schema, hairstyle);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Input is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // validate category existence
    const lengthCategory = await categoryDao.getById(hairstyle.lengthCategoryId);
    const faceshapeCategory = await categoryDao.getById(hairstyle.faceshapeCategoryId);

    if (!lengthCategory) {
      res.status(400).json({
        code: "lengthCategoryDoesNotExist",
        message: "Length category does not exist",
      });
      return;
    }

    if (!faceshapeCategory) {
      res.status(400).json({
        code: "faceshapeCategoryDoesNotExist",
        message: "Faceshape category does not exist",
      });
      return;
    }

    // store hairstyle to a persistant storage
    try {
      hairstyle = await hairstyleDao.create(hairstyle);
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
    res.json(hairstyle);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl; 
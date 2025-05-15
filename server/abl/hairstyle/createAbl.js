const Ajv = require("ajv");
const ajv = new Ajv();

const hairstyleDao = require("../../dao/storage/hairstyle-dao");
const lengthCategoryDao = require("../../dao/storage/length-category-dao");
const faceshapeCategoryDao = require("../../dao/storage/faceshape-category-dao");

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
    const hairstyle = req.body;
    // Validate referenced categories
    const lengthCategory = lengthCategoryDao.getById(hairstyle.lengthCategoryId);
    const faceshapeCategory = faceshapeCategoryDao.getById(hairstyle.faceshapeCategoryId);
    if (!lengthCategory) {
      return res.status(400).json({ code: "lengthCategoryNotFound", message: "Length category not found" });
    }
    if (!faceshapeCategory) {
      return res.status(400).json({ code: "faceshapeCategoryNotFound", message: "Faceshape category not found" });
    }
    const created = hairstyleDao.create(hairstyle);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl; 
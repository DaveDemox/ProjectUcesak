const hairstyleDao = require("../../dao/storage/hairstyle-dao");

async function GetAbl(req, res) {
  try {
    const hairstyle = await hairstyleDao.getById(req.params.id);
    if (!hairstyle) {
      res.status(404).json({
        code: "hairstyleNotFound",
        message: "Hairstyle not found",
      });
      return;
    }
    res.json(hairstyle);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl; 
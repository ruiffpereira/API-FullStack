const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  upsertCategory,
  deleteCategory,
} = require("../../../controllers/backoffice/ecommerce/categoryController");
const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id?", upsertCategory);
router.delete("/:id", deleteCategory);

module.exports = router;

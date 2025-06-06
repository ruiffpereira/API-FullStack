const express = require("express");
const {
  getAllSubcategories,
  getSubcategoryById,
  upsertSubcategory,
  deleteSubcategory,
} = require("../../../controllers/backoffice/ecommerce/subcategoryController");
const router = express.Router();

router.get("/", getAllSubcategories);
router.get("/:id", getSubcategoryById);
router.put("/:id?", upsertSubcategory);
router.delete("/:id", deleteSubcategory);

module.exports = router;

const express = require("express");
const router = express.Router();
const { SubCategoryController } = require("../controllers");

const subCategoryController = new SubCategoryController();

// Create Category
router.post("/category", async (req, res) => {
  const params = req.body;
  const data = await subCategoryController.createSubCategory(params);
  res.send(JSON.stringify(data));
});

// Get Category
router.get("/category", async (req, res) => {
  const params = req.body;
  const data = await subCategoryController.readSubCategory(params);
  res.send(JSON.stringify(data));
});

// Update Category
router.put("/category", async (req, res) => {
  const params = req.body;
  const data = await subCategoryController.updateSubCategory(params);
  res.send(JSON.stringify(data));
});

// Delete Category
router.delete("/category", async (req, res) => {
  const params = req.body;
  const data = await subCategoryController.deleteSubCategory(params);
  res.send(JSON.stringify(data));
});

module.exports = router;

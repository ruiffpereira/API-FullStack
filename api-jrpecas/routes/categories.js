const express = require("express");
const router = express.Router();
const { CategoryController } = require("../controllers");

const categoryController = new CategoryController();

// Create Category
router.post("/category", async (req, res) => {
  const params = req.body;
  const data = await categoryController.createCategory(params);
  res.send(JSON.stringify(data));
});

// Get Category
router.get("/category", async (req, res) => {
  const params = req.body;
  const data = await categoryController.readCategory(params);
  res.send(JSON.stringify(data));
});

// Update Category
router.put("/category", async (req, res) => {
  const params = req.body;
  const data = await categoryController.updateCategory(params);
  res.send(JSON.stringify(data));
});

// Delete Category
router.delete("/category", async (req, res) => {
  const params = req.body;
  const data = await categoryController.deleteCategory(params);
  res.send(JSON.stringify(data));
});

module.exports = router;

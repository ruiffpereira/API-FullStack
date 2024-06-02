const express = require("express");
const router = express.Router();
const { OrderController } = require("../controllers");

const subCategoryController = new SubCategoryController();

// Create Order
router.post("/order", async (req, res) => {
  const params = req.body;
  const data = await OrderController.createSubCategory(params);
  res.send(JSON.stringify(data));
});

// Get Order
router.get("/order", async (req, res) => {
  const params = req.body;
  const data = await OrderController.readSubCategory(params);
  res.send(JSON.stringify(data));
});

// Update Order
router.put("/order", async (req, res) => {
  const params = req.body;
  const data = await OrderController.updateSubCategory(params);
  res.send(JSON.stringify(data));
});

// Delete Order
router.delete("/order", async (req, res) => {
  const params = req.body;
  const data = await OrderController.deleteSubCategory(params);
  res.send(JSON.stringify(data));
});

module.exports = router;

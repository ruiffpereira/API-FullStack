const express = require("express");
const router = express.Router();
const { ProductController } = require("../controllers");

const productController = new ProductController();

// Create Product
router.post("/product", async (req, res) => {
  console.log("postproduct");
  const params = req.body;
  const data = await productController.createProduct(params);
  res.send(JSON.stringify(data));
});

// Get Products
router.get("/product", async (req, res) => {
  const params = req.body;
  console.log("getproduct");
  const data = await productController.readProduct(params);
  res.send(JSON.stringify(data));
});

// Update Product
router.put("/product", async (req, res) => {
  const params = req.body;
  const data = await productController.updateProduct(params);
  res.send(JSON.stringify(data));
});

// Delete Product
router.delete("/product", async (req, res) => {
  const params = req.body;
  const data = await productController.deleteProduct(params);
  res.send(JSON.stringify(data));
});

module.exports = router;

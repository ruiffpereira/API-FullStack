const express = require("express");
const router = express.Router();
const { OrderProductController } = require("../controllers");

const orderProductController = new OrderProductController();

// Create Order and Product
router.post("/orderproduct", async (req, res) => {
  const params = req.body;
  const data = await orderProductController.createOrderProduct(params);
  res.send(JSON.stringify(data));
});

// Get Order and Product
router.get("/orderproduct", async (req, res) => {
  const params = req.body;
  const data = await orderProductController.readOrderProduct(params);
  res.send(JSON.stringify(data));
});

// Update Order and Product
router.put("/orderproduct", async (req, res) => {
  const params = req.body;
  const data = await orderProductController.updateOrderProduct(params);
  res.send(JSON.stringify(data));
});

// Delete Order and Product
router.delete("/orderproduct", async (req, res) => {
  const params = req.body;
  const data = await orderProductController.deleteOrderProduct(params);
  res.send(JSON.stringify(data));
});

module.exports = router;

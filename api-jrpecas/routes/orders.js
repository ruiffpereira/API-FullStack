const express = require("express");
const router = express.Router();
const { OrderController } = require("../controllers");

const orderController = new OrderController();

// Create Order
router.post("/order", async (req, res) => {
  const params = req.body;
  const data = await orderController.createOrder(params);
  res.send(JSON.stringify(data));
});

// Get Order
router.get("/order", async (req, res) => {
  const params = req.body;
  const data = await orderController.readOrder(params);
  res.send(JSON.stringify(data));
});

// Update Order
router.put("/order", async (req, res) => {
  const params = req.body;
  const data = await orderController.updateOrder(params);
  res.send(JSON.stringify(data));
});

// Delete Order
router.delete("/order", async (req, res) => {
  const params = req.body;
  const data = await orderController.deleteOrder(params);
  res.send(JSON.stringify(data));
});

module.exports = router;

const express = require("express");
const {
  createOrder,
  createPaymentIntent,
  getOrders,
  getOrderById,
  testSendEmail,
} = require("../../../controllers/websites/ecommerce/ordersController");
const router = express.Router();

router.post("/payment-intent", createPaymentIntent);
router.get("/", getOrders);
// router.post("/", createOrder);
router.get("/:id", getOrderById);
router.post("/", testSendEmail);

module.exports = router;

const express = require("express");
const {
  getOrderByCustomerId,
  getOrderByOrderId,
  getOrdersByProductId,
} = require("../../../controllers/backoffice/ecommerce/orderProductController");
const router = express.Router();

router.get("/:id", getOrderByCustomerId);
router.get("/orderid/:id", getOrderByOrderId);
router.get("/productid/:id", getOrdersByProductId);

module.exports = router;

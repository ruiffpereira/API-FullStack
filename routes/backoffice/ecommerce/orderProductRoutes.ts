import { Router } from "express";
import {
  getOrderByCustomerId,
  getOrderByOrderId,
  getOrdersByProductId,
} from "../../../controllers/backoffice/ecommerce/orderProductController";

const router = Router();

router.get("/orderid/:id", getOrderByOrderId);
router.get("/productid/:id", getOrdersByProductId);
router.get("/:id", getOrderByCustomerId);

export default router;

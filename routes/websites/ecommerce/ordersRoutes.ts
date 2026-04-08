import { Router } from "express";
import {
  createOrder,
  createPaymentIntent,
  getOrders,
  getOrderById,
} from "../../../controllers/websites/ecommerce/ordersController";

const router = Router();

router.post("/payment-intent", createPaymentIntent);
router.get("/", getOrders);
router.get("/:id", getOrderById);
// router.post('/', createOrder);

export default router;

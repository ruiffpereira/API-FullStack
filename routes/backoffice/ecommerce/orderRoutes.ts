import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderByCustomerId,
} from "../../../controllers/backoffice/ecommerce/orderController";

const router = Router();

router.get("/", getAllOrders);
router.get("/customerid/:id", getOrderByCustomerId);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;

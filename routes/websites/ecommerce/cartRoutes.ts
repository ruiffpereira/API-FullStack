import { Router } from "express";
import {
  addProductToCart,
  getCartItems,
} from "../../../controllers/websites/ecommerce/cartController";

const router = Router();

router.post("/", addProductToCart);
router.get("/", getCartItems);

export default router;

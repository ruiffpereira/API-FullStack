import { Router } from "express";
import { getAllProducts } from "../../../controllers/websites/ecommerce/productsController";

const router = Router();

router.get("/", getAllProducts);

export default router;

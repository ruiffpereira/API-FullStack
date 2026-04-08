import { Router } from "express";
import {
  loginCustomer,
  registerCustomer,
} from "../../../controllers/websites/customers/customerController";

const router = Router();

router.post("/login", loginCustomer);
router.post("/register", registerCustomer);

export default router;

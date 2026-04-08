import { Router } from "express";
import {
  getAllCustomers,
  getCustomerById,
} from "../../../controllers/backoffice/customers/customerController";

const router = Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);

export default router;

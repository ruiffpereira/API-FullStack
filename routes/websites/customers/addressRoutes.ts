import { Router } from "express";
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../../../controllers/websites/customers/adressController";

const router = Router();

router.post("/", createAddress);
router.get("/", getAddresses);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

export default router;

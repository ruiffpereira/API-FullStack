import { Router } from "express";
import {
  getAllSubcategories,
  getSubcategoryById,
  upsertSubcategory,
  deleteSubcategory,
} from "../../../controllers/backoffice/ecommerce/subcategoryController";

const router = Router();

router.get("/", getAllSubcategories);
router.get("/:id", getSubcategoryById);
router.put("/:id?", upsertSubcategory);
router.delete("/:id", deleteSubcategory);

export default router;

import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  upsertCategory,
  deleteCategory,
} from "../../../controllers/backoffice/ecommerce/categoryController";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id?", upsertCategory);
router.delete("/:id", deleteCategory);

export default router;

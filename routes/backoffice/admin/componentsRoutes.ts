import { Router } from "express";
import {
  createComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
} from "../../../controllers/backoffice/admin/componentsController";

const router = Router();

router.post("/", createComponent);
router.get("/", getAllComponents);
router.get("/:id", getComponentById);
router.put("/:id", updateComponent);
router.delete("/:id", deleteComponent);

export default router;

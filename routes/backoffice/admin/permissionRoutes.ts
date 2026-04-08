import { Router } from "express";
import {
  getAllPermissions,
  createPermission,
  updatePermissionById,
  getPermissionById,
  deletePermissionById,
} from "../../../controllers/backoffice/admin/permissionController";

const router = Router();

router.get("/", getAllPermissions);
router.post("/", createPermission);
router.put("/:id", updatePermissionById);
router.get("/:id", getPermissionById);
router.delete("/:id", deletePermissionById);

export default router;

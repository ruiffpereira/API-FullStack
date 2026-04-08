import { Router } from "express";
import {
  checkUserPermission,
  getUserComponentsPermissions,
} from "../../../controllers/backoffice/admin/userPermissionController";

const router = Router();

router.post("/", checkUserPermission);
router.get("/", getUserComponentsPermissions);

export default router;

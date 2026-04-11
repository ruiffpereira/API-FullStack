import { Router, RequestHandler } from "express";
import {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} from "../../../controllers/backoffice/admin/userController";
import {
  authenticateToken,
  authorizePermissions,
} from "../../../src/middleware/auth";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizePermissions(["VIEW_ADMIN"]),
  getAllUsers,
);
router.post(
  "/register",
  authenticateToken,
  authorizePermissions(["VIEW_ADMIN"]),
  registerUser,
);
router.post("/login", loginUser);
router.put(
  "/",
  authenticateToken,
  authorizePermissions(["VIEW_ADMIN"]),
  updateUser,
);
router.delete(
  "/:userId",
  authenticateToken,
  authorizePermissions(["VIEW_ADMIN"]),
  deleteUser as unknown as RequestHandler,
);

export default router;

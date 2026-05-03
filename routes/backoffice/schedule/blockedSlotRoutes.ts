import { Router } from "express";
import {
  getBlockedSlots,
  createBlockedSlot,
  deleteBlockedSlot,
} from "../../../controllers/backoffice/schedule/blockedSlotController";

const router = Router();

router.get("/", getBlockedSlots);
router.post("/", createBlockedSlot);
router.delete("/:id", deleteBlockedSlot);

export default router;

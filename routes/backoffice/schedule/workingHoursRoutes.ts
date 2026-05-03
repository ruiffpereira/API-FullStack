import { Router } from "express";
import {
  getWorkingHours,
  upsertWorkingHours,
  deleteWorkingHours,
} from "../../../controllers/backoffice/schedule/workingHoursController";

const router = Router();

router.get("/", getWorkingHours);
router.post("/", upsertWorkingHours);
router.delete("/:id", deleteWorkingHours);

export default router;

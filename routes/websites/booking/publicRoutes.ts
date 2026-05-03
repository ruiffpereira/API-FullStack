import { Router } from "express";
import {
  getPublicServices,
  getAvailableSlots,
  createPublicAppointment,
  cancelPublicAppointment,
  getAppointmentByToken,
} from "../../../controllers/websites/booking/publicController";

const router = Router();

router.get("/services", getPublicServices);
router.get("/slots", getAvailableSlots);
router.post("/appointments", createPublicAppointment);
router.get("/appointments/:cancelToken", getAppointmentByToken);
router.patch("/appointments/:cancelToken/cancel", cancelPublicAppointment);

export default router;

import { Router } from "express";
import {
  getAllAppointments,
  getAppointmentById,
  createAppointmentBO,
  updateAppointmentStatus,
  deleteAppointment,
} from "../../../controllers/backoffice/schedule/appointmentController";

const router = Router();

router.get("/", getAllAppointments);
router.get("/:id", getAppointmentById);
router.post("/", createAppointmentBO);
router.put("/:id", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);

export default router;

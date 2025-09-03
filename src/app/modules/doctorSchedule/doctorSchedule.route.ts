import { UserRole } from "@prisma/client";
import express from "express";
import { authValidation } from "../../middlewares/authValidation";
import { doctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router();

router.get(
  "/",
  authValidation(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.SUPER_ADMIN,
    UserRole.PATIENT
  ),
  doctorScheduleController.getAllFromDB
);

router.get(
  "/my-schedule",
  authValidation(UserRole.DOCTOR),
  doctorScheduleController.getMySchedule
);

router.post(
  "/",
  authValidation(UserRole.DOCTOR),
  doctorScheduleController.createIntoDB
);

router.delete(
  "/:id",
  authValidation(UserRole.DOCTOR),
  doctorScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;

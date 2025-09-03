import { UserRole } from "@prisma/client";
import express from "express";
import { authValidation } from "./../../middlewares/authValidation";
import { scheduleController } from "./schedule.controller";

const router = express.Router();

router.get(
  "/",
  authValidation(UserRole.ADMIN, UserRole.DOCTOR),
  scheduleController.getAllFromDB
);

router.get(
  "/:id",
  authValidation(UserRole.ADMIN, UserRole.DOCTOR),
  scheduleController.getByIdFromDB
);

router.post(
  "/",
  authValidation(UserRole.ADMIN, UserRole.DOCTOR),
  scheduleController.createIntoDB
);

router.delete(
  "/:id",
  authValidation(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleController.deleteFromDB
);
export const ScheduleRoutes = router;

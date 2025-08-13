import express from "express";
import { authValidation } from "../../middlewares/authValidation";
import { UserRole } from "../../../generated/prisma";
import { PrescriptionController } from "./prescription.controller";

const router = express.Router();

router.post(
  "/create-prescription",
  authValidation(UserRole.DOCTOR),
  PrescriptionController.createIntoDB
);

export const PrescriptionRoutes = router;

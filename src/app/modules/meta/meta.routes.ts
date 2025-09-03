import { UserRole } from "@prisma/client";
import express from "express";
import { authValidation } from "../../middlewares/authValidation";
import { MetaController } from "./meta.controller";

const router = express.Router();

router.get(
  "/",
  authValidation(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
    UserRole.SUPER_ADMIN
  ),
  MetaController.fetcheDashboardMetaData
);

export const MetaRoutes = router;

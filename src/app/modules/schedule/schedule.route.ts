import { authValidation } from "./../../middlewares/authValidation";
import express from "express";
import { scheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/", scheduleController.createIntoDB);

export const ScheduleRoutes = router;

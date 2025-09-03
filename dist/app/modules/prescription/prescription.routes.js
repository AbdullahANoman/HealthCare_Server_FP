"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authValidation_1 = require("../../middlewares/authValidation");
const prescription_controller_1 = require("./prescription.controller");
const router = express_1.default.Router();
router.post("/create-prescription", (0, authValidation_1.authValidation)(client_1.UserRole.DOCTOR), prescription_controller_1.PrescriptionController.createIntoDB);
router.get("/my-prescription", (0, authValidation_1.authValidation)(client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), prescription_controller_1.PrescriptionController.getMyPrescription);
exports.PrescriptionRoutes = router;

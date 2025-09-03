"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authValidation_1 = require("../../middlewares/authValidation");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.post("/", (0, authValidation_1.authValidation)(client_1.UserRole.PATIENT), review_controller_1.ReviewController.createIntoDB);
router.get("/", (0, authValidation_1.authValidation)(client_1.UserRole.DOCTOR), review_controller_1.ReviewController.getAllReview);
exports.ReviewRoutes = router;

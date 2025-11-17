"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { AppointmentService } from "./app/modules/appointment/appointment.service";
// import cron from "node-cron";
// import ApiError from "./app/errors/ApiError";
// import httpStatus from "http-status";
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const app = (0, express_1.default)();
// parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const allowedOrigins = [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://health-care-client-fp.vercel.app",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/admins", adminRoutes);
// cron.schedule("* * * * *", () => {
//   try {
//     AppointmentService.cancelUnpaidAppointments();
//   } catch (error) {
//     throw new ApiError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to cancel unpaid appointments"
//     );
//   }
// });
app.get("/", (req, res) => {
    res.send("HealthBridge backend is running 🚀");
});
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandler_1.globalErrorHandler);
//Not Found
app.use(notFound_1.default);
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "Api Not Found",
        error: {
            path: `${req.originalUrl} is wrong`,
            message: "Your requested path is not found ",
        },
    });
});
exports.default = app;

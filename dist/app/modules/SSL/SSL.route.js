"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSLRoutes = void 0;
const express_1 = __importDefault(require("express"));
const SSL_controller_1 = require("./SSL.controller");
const router = express_1.default.Router();
router.get("/all-payments", SSL_controller_1.sslController.getAllFromDB);
exports.SSLRoutes = router;

import express, { NextFunction, Request, Response } from "express";
import { sslController } from "./SSL.controller";


const router = express.Router();


router.get("/all-payments", sslController.getAllFromDB);


export const SSLRoutes = router;
import status from "http-status";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { AppointmentService } from "./app/modules/appointment/appointment.service";
import cron from "node-cron";
import ApiError from "./app/errors/ApiError";
import httpStatus from "http-status";
import notFound from "./app/middlewares/notFound";
const app: Application = express();



// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:3001","https://health-care-client-fp-one.vercel.app/"], 
  credentials: true              
}));



// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/admins", adminRoutes);


cron.schedule('* * * * *', () => {
  try {
    AppointmentService.cancelUnpaidAppointments()
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to cancel unpaid appointments');
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('HealthBridge backend is running 🚀');
});

app.use("/api/v1", router);

app.use(globalErrorHandler);


//Not Found
app.use(notFound)


app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "Api Not Found",
    error: {
      path: `${req.originalUrl} is wrong`,
      message: "your requested path is not found ",
    },
  });
});

export default app;

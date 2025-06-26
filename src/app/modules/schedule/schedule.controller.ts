import { NextFunction, Request, RequestHandler, Response } from "express";
import pick from "../../../shared/pick";
import { sendResponse } from "../../../helpers/sendResponse";
import { catchAsync } from "../../../helpers/catchAsync";
import { scheduleServices } from "./schedule.service";

const createIntoDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await scheduleServices.createIntoDB(payload);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Scehdule Created Successfully",
      data: result,
    });
  }
);

export const scheduleController = {
  createIntoDB,
};

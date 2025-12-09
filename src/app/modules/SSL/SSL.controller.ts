import { Request, Response } from "express";
import { catchAsync } from "../../../helpers/catchAsync";
import { sendResponse } from "../../../helpers/sendResponse";
import { SSlService } from "./SSL.service";
import status from "http-status";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SSlService.getAllPayments();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "All Payments retrieved successfully",
    data: result,
  });
});


export const sslController = {
  getAllFromDB,
};
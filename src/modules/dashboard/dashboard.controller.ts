import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DashboardService } from "./dashboard.service";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
	const result = await DashboardService.getDashboardStats();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Dashboard summary statistics retrieved successfully",
		data: result,
	});
});

export const DashboardController = {
	getDashboardStats,
};

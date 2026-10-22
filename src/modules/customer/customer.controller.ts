import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CustomerService } from "./customer.service"; // ✅ সার্ভিস ইমপোর্ট করা হলো

const getCustomers = catchAsync(async (req: Request, res: Response) => {
	const result = await CustomerService.getCustomers(); 

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Customers retrieved successfully",
		data: result,
	});
});

const createCustomer = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const result = await CustomerService.createCustomer(payload);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Customer created successfully",
		data: result,
	});
});

export const CustomerController = {
	getCustomers,
	createCustomer,
};

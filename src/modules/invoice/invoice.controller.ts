import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { InvoiceService } from "./invoice.service";

const createInvoice = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const result = await InvoiceService.createInvoice(payload);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Invoice created successfully",
		data: result,
	});
});

const getAllInvoices = catchAsync(async (req: Request, res: Response) => {
	const result = await InvoiceService.getAllInvoices();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Invoices retrieved successfully",
		data: result,
	});
});

export const InvoiceController = {
	createInvoice,
	getAllInvoices,
};

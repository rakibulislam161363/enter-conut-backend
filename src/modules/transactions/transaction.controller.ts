import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TransactionService } from "./transaction.service";

const createTransaction = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const result = await TransactionService.createTransaction(payload);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Transaction recorded successfully",
		data: result,
	});
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
	const result = await TransactionService.getAllTransactions();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Transactions retrieved successfully",
		data: result,
	});
});

export const TransactionController = {
	createTransaction,
	getAllTransactions,
};

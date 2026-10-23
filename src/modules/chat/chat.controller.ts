import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ChatService } from "./chat.service";

const handleChat = catchAsync(async (req: Request, res: Response) => {
	const { message } = req.body;
	if (!message) {
		sendResponse(res, {
			statusCode: httpStatus.BAD_REQUEST,
			success: false,
			message: "Message parameter is required",
			data: null,
		});
		return;
	}

	const result = await ChatService.generateAiReply(message);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "AI response generated successfully",
		data: result,
	});
});

export const ChatController = {
	handleChat,
};

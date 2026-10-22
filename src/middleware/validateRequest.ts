import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (zodSchema: any) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const payload = req.body ?? {};

		const result = await zodSchema.safeParseAsync({
			body: payload,
			query: req.query,
			params: req.params,
			cookies: req.cookies
		});

		if (!result.success) {
			console.log("=== ZOD VALIDATION ERROR ===");
			console.log(result.error.issues);

			// জড এররের প্রথম ইস্যুটির মেসেজ এবং ফিল্ডের নাম বের করা হলো
			const firstIssue = result.error.issues[0];
			const fieldPath = firstIssue?.path ? firstIssue.path.join(".") : "input";
			const errorMessage = `${fieldPath}: ${firstIssue?.message || "Invalid input"}`;

			throw new AppError(httpStatus.BAD_REQUEST, errorMessage);
		}

		// ✅ শুধুমাত্র body অ্যাসাইন করা হলো (query এবং params বাদ দেওয়া হয়েছে কারণ সেগুলো read-only)
		req.body = result.data.body;

		next();
	});
};

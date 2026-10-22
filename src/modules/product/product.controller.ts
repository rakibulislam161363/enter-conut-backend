import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";     // ✅ আপনার প্রোজেক্টের পাথ অনুযায়ী ইমপোর্ট করা হয়েছে
import { sendResponse } from "../../utils/sendResponse"; // ✅ আপনার প্রোজেক্টের পাথ অনুযায়ী ইমপোর্ট করা হয়েছে
import { ProductService } from "./product.service";


// 1. ক্রিয়েট প্রোডাক্ট
const createProduct = catchAsync(async (req: Request, res: Response) => {
	const result = await ProductService.createProduct(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Product created successfully",
		data: result,
	});
});

// 2. গেট অল প্রোডাক্টস
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
	const search = req.query.search as string | undefined;
	const result = await ProductService.getAllProducts(search);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Products retrieved successfully",
		data: result,
	});
});

// 3. গেট প্রোডাক্ট বাই আইডি
const getProductById = catchAsync(async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const result = await ProductService.getProductById(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Product fetched successfully",
		data: result,
	});
});

// 4. আপডেট প্রোডাক্ট
const updateProduct = catchAsync(async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const result = await ProductService.updateProduct(id, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Product updated successfully",
		data: result,
	});
});

// 5. ডিলিট প্রোডাক্ট
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const result = await ProductService.deleteProduct(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: result?.message || "Product deleted successfully",
		data: null,
	});
});

export const ProductController = {
	createProduct,
	getAllProducts,
	getProductById,
	updateProduct,
	deleteProduct,
};

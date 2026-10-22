import { z } from "zod";

// ১. প্রোডাক্ট তৈরি করার ভ্যালিডেশন স্কিমা (সার্ভিস ফাইলের ফিল্ড অনুযায়ী)
const CreateProductZodSchema = z.object({
	body: z.object({
		name: z.string()
			.min(3, "Product name must be at least 3 characters long"),
		
		sku: z.string()
			.min(3, "SKU must be at least 3 characters long"),
		
		category: z.string().optional().nullable(),
		
		price: z.number()
			.positive("Price must be a positive number")
			.or(z.string().regex(/^\d+(\.\d+)?$/, "Price must be a valid number string")), // স্ট্রিং বা নাম্বার উভয়ই হ্যান্ডেল করবে
		
		stock: z.number()
			.int("Stock must be an integer")
			.nonnegative("Stock cannot be negative")
			.or(z.string().regex(/^\d+$/, "Stock must be a valid integer string")) // স্ট্রিং বা নাম্বার উভয়ই হ্যান্ডেল করবে
	}),
});

// ২. প্রোডাক্ট আপডেট করার ভ্যালিডেশন স্কিমা
const UpdateProductZodSchema = z.object({
	body: CreateProductZodSchema.shape.body.partial(),
});

export const ProductValidation = {
	CreateProductZodSchema,
	UpdateProductZodSchema,
};

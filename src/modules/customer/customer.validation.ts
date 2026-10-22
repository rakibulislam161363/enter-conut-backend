import { z } from "zod";

// কাস্টমার তৈরি করার জন্য জড ভ্যালিডেশন স্কিমা
const CreateCustomerZodSchema = z.object({
	body: z.object({
		name: z.string()
			.min(3, "Customer name must be at least 3 characters long"),
		
		email: z.string()
			.email("Invalid email address"),
		
		phone: z.string()
			.min(6, "Phone number must be at least 6 characters long")
			.optional()
			.nullable(),
	}),
});

export const CustomerValidation = {
	CreateCustomerZodSchema,
};

import { z } from "zod";

const CreateTransactionZodSchema = z.object({
	body: z.object({
		type: z.enum(["INCOME", "EXPENSE"]), // ✅ Removed the 'required_error' object block completely to resolve the overload mismatch
		category: z.string().optional().nullable(),
		amount: z.number().positive("Amount must be a positive number"),
		description: z.string().optional().nullable(),
	}),
});

export const TransactionValidation = {
	CreateTransactionZodSchema,
};

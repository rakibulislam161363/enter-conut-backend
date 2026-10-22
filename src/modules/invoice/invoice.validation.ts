import { z } from "zod";

const CreateInvoiceZodSchema = z.object({
	body: z.object({
		customerId: z.number().int("Customer ID must be an integer"),
		discount: z.number().nonnegative().optional().nullable(),
		tax: z.number().nonnegative().optional().nullable(),
		items: z.array(
			z.object({
				productId: z.number().int("Product ID must be an integer"),
				quantity: z.number().int().positive("Quantity must be at least 1"),
				price: z.number().positive("Price must be a positive number"),
			})
		).min(1, "Invoice must contain at least one item"),
	}),
});

export const InvoiceValidation = {
	CreateInvoiceZodSchema,
};

import { Router } from "express";
import { InvoiceController } from "./invoice.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { InvoiceValidation } from "./invoice.validation";
import { auth } from "../../middleware/auth";

const router = Router();

router.post(
	"/",
	auth("ADMIN", "USER"),
	validateRequest(InvoiceValidation.CreateInvoiceZodSchema),
	InvoiceController.createInvoice,
);

router.get(
	"/",
	auth("ADMIN", "USER"),
	InvoiceController.getAllInvoices,
);

export const InvoiceRoutes = router;

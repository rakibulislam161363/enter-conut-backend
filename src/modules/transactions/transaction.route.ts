import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { TransactionValidation } from "./transaction.validation";
import { auth } from "../../middleware/auth";

const router = Router();

router.post(
	"/",
	auth("ADMIN", "USER"),
	validateRequest(TransactionValidation.CreateTransactionZodSchema),
	TransactionController.createTransaction,
);

router.get(
	"/",
	auth("ADMIN", "USER"),
	TransactionController.getAllTransactions,
);

export const TransactionRoutes = router;

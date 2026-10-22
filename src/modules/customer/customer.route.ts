import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { validateRequest } from "../../middleware/validateRequest"; // ✅ প্রজেক্টের গ্লোবাল পাথ অনুযায়ী
import { CustomerValidation } from "./customer.validation";
import { auth } from "../../middleware/auth"; // ✅ গ্লোবাল রোল-বেসড অথ মিডলওয়্যার

const router = Router();

// ১. নতুন কাস্টমার তৈরি করা (ADMIN এবং USER উভয়ই পারবে)
router.post(
	"/",
	auth("ADMIN", "USER"),
	validateRequest(CustomerValidation.CreateCustomerZodSchema),
	CustomerController.createCustomer,
);

// ২. সকল কাস্টমার লিস্ট দেখা
router.get(
	"/",
	auth("ADMIN", "USER"),
	CustomerController.getCustomers,
);

export const CustomerRoutes = router;
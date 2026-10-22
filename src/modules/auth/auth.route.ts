import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "./auth.validation";
import { auth } from "../../middleware/auth";
export type Role = "ADMIN" | "USER";

const router = Router();

// ১. ইউজার রেজিস্ট্রেশন (এখানে ওটিপি পাঠানো হবে)
router.post(
	"/register",
	validateRequest(UserValidation.RegistrationZodSchema), 
	AuthController.register,
);

// ২. ইমেইল ওটিপি ভেরিফিকেশন (এখানে অ্যাকাউন্ট ভেরিফাই হবে এবং টোকেন দেওয়া হবে)
router.post(
	"/verify-email",
	validateRequest(UserValidation.EmailVerifyZodSchema), // সাধারণ ইমেইল ভেরিফিকেশন স্কিমা
	AuthController.verifyEmail,
);

router.post(
	"/login",
	validateRequest(UserValidation.LoginZodSchema),
	AuthController.loginUser,
);

router.get(
	"/me",
	auth("ADMIN", "USER"),
	AuthController.getMe,
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
	"/forgot-password",
	validateRequest(UserValidation.ForgotPasswordZodSchema),
	AuthController.forgotPassword,
);

router.post(
	"/reset-password",
	validateRequest(UserValidation.ResetPasswordZodSchema),
	AuthController.resetPassword,
);

export const AuthRoutes = router;

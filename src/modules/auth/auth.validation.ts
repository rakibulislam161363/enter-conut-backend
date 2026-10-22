import { z } from "zod";

// 1. Registration Validation Schema
const RegistrationZodSchema = z.object({
	body: z.object({
		fullName: z.string()
			.min(3, "Full name must be at least 3 characters long"),
		
		email: z.string()
			.email("Invalid email address"),
		
		password: z.string()
			.min(6, "Password must be at least 6 characters long"),
		
		companyName: z.string().optional().nullable(),
	}),
});

// 2. Email OTP Verification Validation Schema
const EmailVerifyZodSchema = z.object({
	body: z.object({
		email: z.string()
			.email("Invalid email address"),
		
		otp: z.string()
			.length(6, "OTP must be exactly 6 digits"),
	}),
});

// 3. Login Validation Schema
const LoginZodSchema = z.object({
	body: z.object({
		email: z.string()
			.email("Invalid email address"),
		
		password: z.string(),
	}),
});

// 4. Forgot Password Validation Schema
const ForgotPasswordZodSchema = z.object({
	body: z.object({
		email: z.string()
			.email("Invalid email address"),
	}),
});

// 5. Reset Password Validation Schema
const ResetPasswordZodSchema = z.object({
	body: z.object({
		email: z.string()
			.email("Invalid email address"),
		
		otp: z.string()
			.length(6, "OTP must be exactly 6 digits"),
		
		newPassword: z.string()
			.min(6, "Password must be at least 6 characters long"),
	}),
});

export const UserValidation = {
	RegistrationZodSchema,
	EmailVerifyZodSchema,
	LoginZodSchema,
	ForgotPasswordZodSchema,
	ResetPasswordZodSchema,
};

import bcrypt from "bcryptjs";
import crypto from "crypto";
import ejs from "ejs";
import httpStatus from "http-status";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import path from "path";

import { transporter } from "../../lib/nodemailer";
import { redisClient } from "../../lib/redis";
import { jwtUtils } from "../../utils/jwt";
import type {
	IForgotPasswordPayload,
	ILoginUserPayload,
	IRegisterUserPayload,
	IRequestUser,
	IResetPasswordPayload,
} from "./auth.interface";
import config from "../../config";
import { AppError } from "../../utils/AppError";
import { db } from "../../prisma/db";

export type Role = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE";

const register = async (payload: IRegisterUserPayload) => {
	const { fullName, password, companyName } = payload;
	const email = payload.email.trim().toLowerCase();
	const isUserExists = await db.orm.public.User
		.where({ email })
		.first();

	if (isUserExists) {
		throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
	}


	const hashedPassword = await bcrypt.hash(password, 8);

	
	const newUser = await db.orm.public.User.create({
		fullName,
		email,
		companyName: companyName || null,
		passwordHash: hashedPassword,
	});

	return newUser;
};

// const register = async (payload: IRegisterUserPayload) => {
// 	const { fullName, password, companyName } = payload;
// 	const email = payload.email.trim().toLowerCase();

// 	const isUserExists = await db.orm.public.User
// 		.where({ email })
// 		.first();

// 	if (isUserExists) {
// 		throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
// 	}

// 	const hashedPassword = await bcrypt.hash(password, 8);
// 	const expirationSeconds = 5 * 60;

// 	// --- register ফাংশনের ভেতর ওটিপি সেভ করার অংশটি এভাবে পরিবর্তন করুন ---
// const otpKey = `user-registration-otp:${email}`;
// const otpValue = crypto.randomInt(100000, 1000000).toString();

// // এক্সপায়রি টাইম সরাসরি EX হিসেবে পাস করে দেখুন (লাইব্রেরি ভেদে এটি সঠিক ফরমেট)
// await redisClient.set(otpKey, otpValue, {
// 	EX: expirationSeconds, // অথবা আপনার আগের মেথড যদি কাজ করে থাকে
// });

// const userRegistrationKey = `user-registration-data:${email}`;
// const redisUserDataPayload = {
// 	fullName,
// 	email,
// 	companyName: companyName || null, 
// 	passwordHash: hashedPassword,
// };

// await redisClient.set(
// 	userRegistrationKey,
// 	JSON.stringify(redisUserDataPayload),
// 	{
// 		EX: expirationSeconds,
// 	},
// );

// 	const tempatePath = path.join(
// 		process.cwd(),
// 		"src/templates/registration-user-otp.ejs",
// 	);

// 	const templateData = {
// 		name: fullName,
// 		email,
// 		otp: otpValue,
// 		expirationMinutes: expirationSeconds / 60,
// 	};

// 	const html = await ejs.renderFile(tempatePath, templateData);

// 	await transporter.sendMail({
// 		from: config.email_sender,
// 		to: email,
// 		subject: "Email Verification",
// 		html,
// 	});
// };

// ✅ নতুন ইমেইল ভেরিফিকেশন সিস্টেম (verifyEmail) যোগ করা হলো
const verifyEmail = async (payload: { email: string; otp: string }) => {
	const email = payload.email.trim().toLowerCase();
	const { otp } = payload;

	const otpKey = `user-registration-otp:${email}`;
	const userRegistrationKey = `user-registration-data:${email}`;

	// ১. রেডিস থেকে ওটিপি এবং ডাটা নিয়ে আসা
	const redisOtp = await redisClient.get(otpKey);
	const redisDataString = await redisClient.get(userRegistrationKey);

	// 🔍 টার্মিনালে চেক করার জন্য লগ (ডাটা না পাওয়া গেলে এখানে দেখতে পারবেন)
	console.log("=== ENTERCOUNT DEBUG ===");
	console.log("Redis OTP:", redisOtp);
	console.log("Redis Data String:", redisDataString ? "Found" : "Null");

	if (!redisOtp || !redisDataString) {
		throw new AppError(httpStatus.BAD_REQUEST, "OTP has expired or registration data not found");
	}

	// ২. ওটিপি ম্যাচ করা (উভয় পাশের স্পেস ট্রিম করে নেওয়া হলো)
	if (redisOtp.trim() !== otp.trim()) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP code");
	}

	const userData = JSON.parse(redisDataString);

	// ৩. ডেটাবেজে ইউজার তৈরি করা
	const newUser = await db.orm.public.User.create({
		fullName: userData.fullName,
		email: userData.email,
		companyName: userData.companyName,
		passwordHash: userData.passwordHash,
		role: "USER",    // Default Role
		status: "ACTIVE" // Verified হওয়ার পর সরাসরি ACTIVE
	});

	// ৪. ওটিপি ভেরিফাইড হয়ে গেলে রেডিস ক্যাশ ডিলিট করা
	await redisClient.del([otpKey, userRegistrationKey]);

	// ৫. ইউজার ভেরিফাইড হলে সরাসরি টোকেন জেনারেট করা
	const jwtPayload = {
		userId: newUser.id,
		name: newUser.fullName,
		email: newUser.email,
		role: newUser.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwtSecret,
		config.jwtExpiration as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwtRefreshSecret,
		config.jwtRefreshExpiration as SignOptions,
	);

	// ৬. প্লেইন অবজেক্ট থেকে সরাসরি passwordHash ওমিট (Omit) করা হলো
	const { passwordHash, ...userResponse } = newUser;

	return {
		accessToken,
		refreshToken,
		user: userResponse,
	};
};



const loginUser = async (payload: ILoginUserPayload) => {
	const { password } = payload;
	const email = payload.email.trim().toLowerCase();

	const user = await db.orm.public.User
		.where({ email })
		.first();

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
	}

	if (user.status === "INACTIVE") {
		throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
	}

	const isPasswordMatched = await bcrypt.compare(
		password,
		user.passwordHash,
	);

	if (!isPasswordMatched) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.fullName,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwtSecret,
		config.jwtExpiration as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwtRefreshSecret,
		config.jwtRefreshExpiration as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const getMe = async (user: any) => {
	// 1. auth.ts-এ যেহেতু 'id' সেট করা হয়েছে, তাই এখানে সরাসরি user.id নেওয়া হলো
	const userId = Number(user?.id);

	// 2. আইডি ভ্যালিড কিনা চেক (NaN প্রোটেকশন)
	if (isNaN(userId)) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid or missing User ID");
	}

	// 3. ডাটাবেজ কুয়েরি
	const isUserExists = await db.orm.public.User
		.where({ id: userId })
		.select("id", "fullName", "companyName", "email", "role", "status", "createdAt")
		.first();

	if (!isUserExists) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	return isUserExists;
};



const logoutUser = async () => {
	return { message: "Logged out successfully" };
};

const refreshToken = async (token: string) => {
	const verifiedRefreshToken = jwtUtils.verifyToken(
		token,
		config.jwtRefreshSecret,
	);

	if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			config.node_env === "development"
				? (verifiedRefreshToken.error ?? "Unknown development error")
				: "Invalid refresh token",
		);
	}

	const data = verifiedRefreshToken.data as JwtPayload;

	const user = await db.orm.public.User
		.where({ id: Number(data.userId) })
		.first();

	if (!user || user.status !== "ACTIVE") {
		throw new AppError(httpStatus.UNAUTHORIZED, "User is inactive or not found");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.fullName,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwtSecret,
		config.jwtExpiration as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwtRefreshSecret,
		config.jwtRefreshExpiration as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const forgotPassword = async (payload: IForgotPasswordPayload) => {
	const { email } = payload;

	const isUserExist = await db.orm.public.User
		.where({ email })
		.first();

	if (!isUserExist) {
		throw new AppError(httpStatus.NOT_FOUND, "User Does Not Exist!");
	}

	if (isUserExist.status === "INACTIVE") {
		throw new AppError(httpStatus.FORBIDDEN, "User is Blocked/Inactive");
	}

	const otp = crypto.randomInt(100000, 1000000).toString();
	const key = `forgor-password-otp:${isUserExist.email}`;
	const expirationSeconds = 5 * 60;

	await redisClient.set(key, otp, {
		expiration: {
			type: "EX",
			value: expirationSeconds,
		},
	});

	const tempatePath = path.join(
		process.cwd(),
		"src/app/templates/forgot-password.ejs",
	);

	const templateData = {
		name: isUserExist.fullName,
		otp,
		expirationMinutes: expirationSeconds / 60,
	};

	const html = await ejs.renderFile(tempatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: isUserExist.email,
		subject: "Forgot Password",
		html,
	});
};

const resetPassword = async (payload: IResetPasswordPayload) => {
	const { email, otp, newPassword } = payload;

	const isUserExist = await db.orm.public.User
		.where({ email })
		.first();

	if (!isUserExist) {
		throw new AppError(httpStatus.NOT_FOUND, "User Does Not Exist!");
	}

	if (isUserExist.status === "INACTIVE") {
		throw new AppError(httpStatus.FORBIDDEN, "User is Blocked/Inactive");
	}

	const key = `forgor-password-otp:${isUserExist.email}`;
	const redisOtp = await redisClient.get(key);

	if (!redisOtp) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
	}

	if (redisOtp !== otp) {
		throw new AppError(httpStatus.BAD_REQUEST, "OTP Does Not Match");
	}

	const hashedNewPassword = await bcrypt.hash(
		newPassword,
		Number(config.bcrypt_salt_rounds),
	);

	await db.orm.public.User
		.where({ email: isUserExist.email })
		.update({
			passwordHash: hashedNewPassword,
		});

	await redisClient.del([key]);

	const tempatePath = path.join(
		process.cwd(),
		"src/app/templates/reset-password-success.ejs",
	);

	const templateData = {
		name: isUserExist.fullName,
	};

	const html = await ejs.renderFile(tempatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: isUserExist.email,
		subject: "Password Changed",
		html,
	});
};

export const AuthService = {
	register,
	verifyEmail,
	loginUser,
	logoutUser,
	getMe,
	refreshToken,
	forgotPassword,
	resetPassword,
};

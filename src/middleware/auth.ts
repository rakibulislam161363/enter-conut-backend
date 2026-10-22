import { type NextFunction, type Request, type Response } from "express";
import config from "../config";
import { type JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { db } from "../prisma/db";
import { AppError } from "../utils/AppError"; // ✅ প্রজেক্টের স্ট্যান্ডার্ড এরর হ্যান্ডলিং এর জন্য ইমপোর্ট করা হলো
import httpStatus from "http-status";

export type Role = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: number;
        email: string;
        fullName: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // ১. টোকেন এক্সট্রাক্ট করা
    const token = req.cookies?.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Access denied. No token provided.");
    }

    // ২. টোকেন ভেরিফাই করা
    const verifiedToken = jwtUtils.verifyToken(token, config.jwtSecret);

    if (!verifiedToken.success) {
      throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.error || "Invalid token");
    }

    // ৩. টোকen থেকে ডাটা এক্সট্রাক্ট (userId এবং role বের করা হচ্ছে)
    const tokenData = verifiedToken.data as JwtPayload;
    const email = tokenData.email;
    const role = tokenData.role;
    
    // 🔍 ফিক্স: সার্ভিস ফাইলের টোকেন পে-লোড (userId) অনুযায়ী আইডি নেওয়া হচ্ছে, না থাকলে ব্যাকআপ হিসেবে id চেক করবে
    const rawUserId = tokenData.userId || tokenData.id; 
    const parsedUserId = Number(rawUserId);

    // 🔍 সেফটি গার্ড: কোনো কারণে আইডি পাওয়া না গেলে বা NaN হলে সরাসরি এপিআই ক্র্যাশ না করিয়ে ৪০১ এরর দেবে
    if (!rawUserId || isNaN(parsedUserId)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid access token payload integrity");
    }

    // ৪. রোল পারমিশন চেক করা (যেমন: ADMIN বা USER)
    if (requiredRoles.length && !requiredRoles.includes(role as Role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Forbidden. You don't have permission to access this resource."
      );
    }

    // ৫. ডাটাবেজ থেকে ইউজার খোঁজা (parsedUserId ব্যবহার করে এবং টাইপ কাস্টিং সেফ রাখা হয়েছে)
    const user = await db.orm.public.User
      .where({
        id: parsedUserId,
        email: email,
      } as any)
      .first();

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }

    // ৬. ইউজার অ্যাক্টিভ কিনা চেক করা
    if (user.status === "INACTIVE") {
      throw new AppError(httpStatus.FORBIDDEN, "User is inactive.");
    }

    // ৭. রিকোয়েস্টে ইউজার অবজেক্ট পাস করা
    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as Role,
    };

    next();
  });
};

import { Router } from "express";
import { ChatController } from "./chat.controller";
import { auth } from "../../middleware/auth";

const router = Router();

// চ্যাট এপিআই রাউট (POST /chat)
router.post(
	"/",
	auth("ADMIN", "USER"), // সুরক্ষিত রাখতে অথেন্টিকেশন লেয়ার
	ChatController.handleChat,
);

export const ChatRoutes = router;

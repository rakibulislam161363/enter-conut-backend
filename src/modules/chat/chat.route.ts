import { Router } from "express";
import { ChatController } from "./chat.controller";
import { auth } from "../../middleware/auth";

const router = Router();
router.post(
	"/",
	auth("ADMIN", "USER"),
	ChatController.handleChat,
);

export const ChatRoutes = router;

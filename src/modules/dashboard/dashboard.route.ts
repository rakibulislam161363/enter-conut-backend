import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { auth } from "../../middleware/auth";

const router = Router();

// ড্যাশবোর্ড স্ট্যাটস রাউট (GET /dashboard/stats)
router.get(
	"/stats",
	auth("ADMIN", "USER"),
	DashboardController.getDashboardStats,
);

export const DashboardRoutes = router;

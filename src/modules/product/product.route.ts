import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest"; // ✅ আপনার আগের প্রজেক্টের পাথ স্ট্রাকচার অনুযায়ী ইমপোর্ট করা
import { auth } from "../../middleware/auth"; // ✅ আপনার আগের গ্লোবাল মিডলওয়্যার পাথ
import { ProductValidation } from "./product.validation";
import { ProductController } from "./product.controller";

const router = Router();

// ১. নতুন প্রোডাক্ট তৈরি (শুধু ADMIN রাউটটি এক্সেস করতে পারবে)
router.post(
	"/create",
	auth("ADMIN", "USER"),
	validateRequest(ProductValidation.CreateProductZodSchema),
	ProductController.createProduct,
);

// ২. সব প্রোডাক্ট দেখা (যেকোনো ইউজার বা পাবলিকলি দেখা যাবে)
router.get("/", ProductController.getAllProducts);

// ৩. আইডি দিয়ে নির্দিষ্ট প্রোডাক্ট দেখা
router.get("/:id", ProductController.getProductById);

// ৪. প্রোডাক্ট আপডেট করা (শুধু ADMIN করতে পারবে)
router.patch(
	"/:id",
	auth("ADMIN", "USER"),
	validateRequest(ProductValidation.UpdateProductZodSchema),
	ProductController.updateProduct,
);

// ৫. প্রোডাক্ট ডিলিট করা (শুধু ADMIN করতে পারবে)
router.delete(
	"/:id",
	auth("ADMIN", "USER"),
	ProductController.deleteProduct,
);

export const ProductRoutes = router;

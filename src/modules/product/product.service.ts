import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { db } from "../../prisma/db";
import type { ICreateProductPayload, IUpdateProductPayload } from "./product.interface";

// 1. প্রোডাক্ট তৈরি
const createProduct = async (payload: ICreateProductPayload) => {
	const { name, sku, category, price, stock } = payload;

	const isProductExists = await db.orm.public.Product
		.where({ sku } as any)
		.first();

	if (isProductExists) {
		throw new AppError(httpStatus.CONFLICT, "Product with this SKU already exists");
	}

	const newProduct = await db.orm.public.Product.create({
		name,
		sku,
		category: category || null,
		price: String(Number(price).toFixed(2)) as any,
		stock: Number(stock) || 0,
	} as any);

	return newProduct;
};

// 2. সব প্রোডাক্ট দেখা (সার্চ ফিল্টার টাইপ ওভারলোড সম্পূর্ণ ফিক্সড)
const getAllProducts = async (search?: string) => {
	let query = db.orm.public.Product;

	if (search) {
		// ✅ কলব্যাক মেথডটিকে সরাসরি 'as any' কাস্ট করার মাধ্যমে ওআরএম এর সমস্ত টাইপ ব্লকেজ দূর করা হয়েছে
		const customSearchFilter = ((model: any): any => {
			return `${model.name} ILIKE '%${search}%' OR ${model.sku} ILIKE '%${search}%'`;
		}) as any;

		query = query.where(customSearchFilter);
	}

	const products = await query.all(); 
	return products;
};

// 3. আইডি দিয়ে নির্দিষ্ট প্রোডাক্ট দেখা
const getProductById = async (id: number) => {
	const product = await db.orm.public.Product
		.where({ id } as any)
		.first();

	if (!product) {
		throw new AppError(httpStatus.NOT_FOUND, "Product not found");
	}

	return product;
};

// 4. প্রোডাক্ট আপডেট
const updateProduct = async (id: number, payload: IUpdateProductPayload) => {
	const isProductExists = await db.orm.public.Product
		.where({ id } as any)
		.first();

	if (!isProductExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Product not found");
	}

	const updateData: any = {
		...payload,
	};

	if (payload.price !== undefined) {
		updateData.price = String(Number(payload.price).toFixed(2));
	}
	if (payload.stock !== undefined) {
		updateData.stock = Number(payload.stock);
	}

	const updatedProduct = await db.orm.public.Product
		.where({ id } as any)
		.update(updateData);

	return updatedProduct;
};

// 5. প্রোডাক্ট ডিলিট
const deleteProduct = async (id: number) => {
	const isProductExists = await db.orm.public.Product
		.where({ id } as any)
		.first();

	if (!isProductExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Product not found");
	}

	await db.orm.public.Product.where({ id } as any).delete();
	
	return { message: "Product deleted successfully" };
};

export const ProductService = {
	createProduct,
	getAllProducts,
	getProductById,
	updateProduct,
	deleteProduct,
};

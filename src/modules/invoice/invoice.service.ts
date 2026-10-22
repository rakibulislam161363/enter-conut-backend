import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { db } from "../../prisma/db";
import type { ICreateInvoicePayload } from "./invoice.interface";

// 1. ইনভয়েস তৈরি করা (Temporal.Instant টাইমস্ট্যাম্প এরর ফিক্সড)
const createInvoice = async (payload: ICreateInvoicePayload) => {
	const { customerId, items, discount, tax } = payload;

	// কাস্টমার ডাটাবেজে আছে কিনা চেক করা
	const customerExists = await db.orm.public.Customer.where({ id: customerId } as any).first();
	if (!customerExists) {
		throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
	}

	let calculatedTotal = 0;

	// প্রতিটি আইটেম প্রসেস ও স্টক ভ্যালিডেশন
	for (const item of items) {
		const product = await db.orm.public.Product.where({ id: item.productId } as any).first();
		
		if (!product) {
			throw new AppError(httpStatus.NOT_FOUND, `Product with ID ${item.productId} not found`);
		}
		
		if (product.stock < Number(item.quantity)) {
			throw new AppError(httpStatus.BAD_REQUEST, `Insufficient stock for product: ${product.name}`);
		}

		calculatedTotal += Number(item.price) * Number(item.quantity);
	}

	// ডিসকাউন্ট এবং ট্যাক্স হিসাব করা
	const discountAmount = Number(discount) || 0;
	const taxAmount = Number(tax) || 0;
	const finalTotalAmount = calculatedTotal - discountAmount + taxAmount;

	// ইউনিক ইনভয়েস নাম্বার তৈরি (INV-17364829)
	const uniqueInvoiceNo = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

	// 🛠️ Prisma Model এর @default(now()) নিয়মের সুবিধা নিতে 'createdAt' ফিল্ডটি সম্পূর্ণ বাদ দেওয়া হয়েছে
	const newInvoice = await db.orm.public.Invoice.create({
		invoiceNo: uniqueInvoiceNo,
		customerId: Number(customerId),
		totalAmount: String(finalTotalAmount.toFixed(2)) as any,
		status: "Pending",
	} as any);

	// প্রতিটি প্রোডাক্টের স্টক কমানো
	for (const item of items) {
		const product = await db.orm.public.Product.where({ id: item.productId } as any).first();
		if (product) {
			await db.orm.public.Product.where({ id: item.productId } as any).update({
				stock: product.stock - Number(item.quantity),
			} as any);
		}
	}

	return newInvoice;
};

// 2. সকল ইনভয়েস দেখা
const getAllInvoices = async () => {
	const invoices = await db.orm.public.Invoice.all();
	return invoices;
};

export const InvoiceService = {
	createInvoice,
	getAllInvoices,
};

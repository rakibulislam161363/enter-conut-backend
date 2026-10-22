import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { db } from "../../prisma/db";
import type { ICreateTransactionPayload } from "./transaction.interface";

// ১. নতুন ট্রানজেকশন তৈরি করা (Numeric টাইপ ও Temporal.Instant ফিক্স সহ)
const createTransaction = async (payload: ICreateTransactionPayload) => {
	const { type, category, amount, description } = payload;

	// 🛠️ আপনার মডেলের কলাম ও ওআরএম এর Numeric রিকোয়ারমেন্ট অনুযায়ী ডাটা পুশ
	const newTransaction = await db.orm.public.Transaction.create({
		type,
		category: category || null,
		amount: String(Number(amount).toFixed(2)) as any, // 💎 Numeric(10, 2) এর টাইপ ওভারলোড ফিক্স
		description: description || null,
		// 💎 'createdAt' বাদ দেওয়া হয়েছে যাতে 'pg/timestamptz-temporal' এনকোড এরর না আসে
	} as any);

	return newTransaction;
};

// ২. সকল ট্রানজেকশন দেখা
const getAllTransactions = async () => {
	const transactions = await db.orm.public.Transaction.all();
	return transactions;
};

export const TransactionService = {
	createTransaction,
	getAllTransactions,
};

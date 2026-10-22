import { db } from "../../prisma/db";

const getDashboardStats = async () => {
	// ১. ডাটাবেজ থেকে সব ট্রানজেকশন নিয়ে আসা
	const transactions = await db.orm.public.Transaction.all();

	let totalIncome = 0;
	let totalExpense = 0;

	// ২. আয় এবং ব্যয়ের মোট হিসাব বের করা
	for (const txn of transactions) {
		const amount = Number(txn.amount) || 0;
		if (txn.type === "INCOME") {
			totalIncome += amount;
		} else if (txn.type === "EXPENSE") {
			totalExpense += amount;
		}
	}

	const netProfit = totalIncome - totalExpense;

	// ৩. মোট প্রোডাক্ট সংখ্যা কাউন্ট করা
	const allProducts = await db.orm.public.Product.all();
	const totalProducts = allProducts.length;

	// ৪. মোট কাস্টমার সংখ্যা কাউন্ট করা
	const allCustomers = await db.orm.public.Customer.all();
	const totalCustomers = allCustomers.length;

	return {
		totalIncome: String(totalIncome.toFixed(2)),
		totalExpense: String(totalExpense.toFixed(2)),
		netProfit: String(netProfit.toFixed(2)),
		totalProducts,
		totalCustomers,
	};
};

export const DashboardService = {
	getDashboardStats,
};

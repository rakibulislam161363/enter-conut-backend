import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { db } from "../../prisma/db";
import type { ICreateCustomerPayload } from "./customer.interface";

// ১. কাস্টমার তৈরি করা
const createCustomer = async (payload: ICreateCustomerPayload) => {
	const { name, email, phone } = payload;

	// ইমেইল দিয়ে অলরেডি কাস্টমার আছে কিনা চেক করা (ঐচ্ছিক কিন্তু নিরাপদ)
	const isCustomerExists = await db.orm.public.Customer
		.where({ email } as any)
		.first();

	if (isCustomerExists) {
		throw new AppError(httpStatus.CONFLICT, "Customer with this email already exists");
	}

	const newCustomer = await db.orm.public.Customer.create({
		name,
		email,
		phone: phone || null,
	} as any);

	return newCustomer;
};

// ২. সকল কাস্টমার ডাটাবেজ থেকে নিয়ে আসা
const getCustomers = async () => {
	// আপনার ORM এর নিয়ম অনুযায়ী সকল কাস্টমার রিট্রিভ করা
	const customers = await db.orm.public.Customer.all(); 
	return customers;
};

export const CustomerService = {
	createCustomer,
	getCustomers,
};

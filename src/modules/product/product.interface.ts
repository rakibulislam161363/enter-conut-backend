export interface ICreateProductPayload {
	name: string;
	sku: string;
	category?: string | null;
	price: number | string; // ✅ স্ট্রিং এবং নাম্বার উভয়ই এলাউড, যা সার্ভিসে Number() দিয়ে পার্স হবে
	stock?: number | string; // ✅ স্ট্রিং এবং নাম্বার উভয়ই এলাউড
}

export interface IUpdateProductPayload {
	name?: string;
	sku?: string;
	category?: string | null;
	price?: number | string;
	stock?: number | string;
}

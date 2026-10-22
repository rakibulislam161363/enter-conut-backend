export interface IInvoiceItem {
	productId: number;
	quantity: number;
	price: number | string; // Numeric<10,2> হ্যান্ডেল করার জন্য
}

export interface ICreateInvoicePayload {
	customerId: number;
	items: IInvoiceItem[];
	discount?: number | string;
	tax?: number | string;
}

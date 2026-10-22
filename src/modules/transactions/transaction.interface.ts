export type TransactionType = "INCOME" | "EXPENSE"; // আপনার প্রিজমা Enum অনুযায়ী

export interface ICreateTransactionPayload {
	type: TransactionType;
	category?: string | null;
	amount: number | string;
	description?: string | null;
}

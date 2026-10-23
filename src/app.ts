import express, { type Application } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { notFound } from "./middleware/notFoundPage";
import { globalErrorHandler } from "./middleware/globalErrorHandaler";
import { AuthRoutes } from "./modules/auth/auth.route";
import { ProductRoutes } from "./modules/product/product.route";
import { CustomerRoutes } from "./modules/customer/customer.route";
import { InvoiceRoutes } from "./modules/invoice/invoice.route";
import { TransactionRoutes } from "./modules/transactions/transaction.route";
import { DashboardRoutes } from "./modules/dashboard/dashboard.route";
import { ChatRoutes } from "./modules/chat/chat.route";

const app: Application = express();

// ১. মিডলওয়্যার ও পার্সারগুলো সবার উপরে থাকবে
app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
);
app.use(express.json()); // <--- এটি এখন সবার আগে কাজ করবে
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ২. এরপর সমস্ত রাউটস ডিক্লেয়ার হবে
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", AuthRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/customer", CustomerRoutes);
app.use("/api/invoice", InvoiceRoutes);
app.use("/api/transaction", TransactionRoutes);
app.use("/api/dashboard", DashboardRoutes);
app.use("/api/chat", ChatRoutes);
app.use(notFound);
app.use(globalErrorHandler);

export default app;

import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import authRoutes from './routers/auth.route.js';
import productRoutes from './routers/product.route.js';
import supplierRoutes from './routers/supplier.route.js';
import transactionRoutes from './routers/transaction.route.js';
import contactRoutes from './routers/contact.route.js';
import subscriptionRoutes from './routers/subscription.route.js';
dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json())
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});
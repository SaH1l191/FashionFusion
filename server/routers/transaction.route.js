import express from 'express';

import {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTotalProfit,
    getMonthlyProfit,
    getProductSummary
} from '../controllers/transaction.controller.js';

import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Transaction routes
router.post('/', protectRoute, createTransaction);
router.get('/', protectRoute, getAllTransactions);
router.get('/profit', protectRoute, getTotalProfit);
router.get('/monthly-profit', protectRoute, getMonthlyProfit);
router.get('/product-summary', protectRoute, getProductSummary);
router.get('/:id', protectRoute, getTransactionById);
router.put('/:id', protectRoute, updateTransaction);
router.delete('/:id', protectRoute, deleteTransaction);

export default router;

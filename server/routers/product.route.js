import express from 'express';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getTopTrendingProduct
} from '../controllers/product.controller.js';

import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();





// Product routes
router.post('/', protectRoute, createProduct);
router.get('/', protectRoute, getAllProducts);
router.get('/trending', protectRoute, getTopTrendingProduct);
router.get('/:id', protectRoute, getProductById);
router.put('/:id', protectRoute, updateProduct);
router.delete('/:id', protectRoute, deleteProduct);


export default router;

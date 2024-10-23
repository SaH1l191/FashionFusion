import express from 'express';
import {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} from '../controllers/supplier.controller.js';

import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();
// Supplier routes
router.post('/', protectRoute, createSupplier);
router.get('/', protectRoute, getAllSuppliers);
router.get('/:id', protectRoute, getSupplierById);
router.put('/:id', protectRoute, updateSupplier);
router.delete('/:id', protectRoute, deleteSupplier);



export default router;
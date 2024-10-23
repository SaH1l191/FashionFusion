import express from 'express';
import { createSubscription, verifySubscription } from '../controllers/auth.controller.js';
import {  protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', protectRoute, createSubscription);
router.post('/verify', protectRoute, verifySubscription);

export default router; 
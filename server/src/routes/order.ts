import { Router } from 'express';
import { createOrder, getOrderHistory, cancelOrder } from '../controllers/orderController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/', authenticateJWT, createOrder);
router.get('/', authenticateJWT, getOrderHistory);
router.patch('/:id/cancel', authenticateJWT, cancelOrder);

export default router; 
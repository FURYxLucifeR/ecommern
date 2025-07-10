import { Router } from 'express';
import { getProfile, updateProfile, getOrderHistory, getTotalExpenses } from '../controllers/userController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.get('/orders', authenticateJWT, getOrderHistory);
router.get('/expenses', authenticateJWT, getTotalExpenses);

export default router; 
import { Router } from 'express';
import { listUsers, deleteUser, getMetrics, updateUserRole } from '../controllers/adminController';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.get('/users', authenticateJWT, authorizeRoles('admin'), listUsers);
router.patch('/users/:id/role', authenticateJWT, authorizeRoles('admin'), updateUserRole);
router.delete('/users/:id', authenticateJWT, authorizeRoles('admin'), deleteUser);
router.get('/metrics', authenticateJWT, authorizeRoles('admin'), getMetrics);

export default router; 
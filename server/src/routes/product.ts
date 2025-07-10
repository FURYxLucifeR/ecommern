import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticateJWT } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin only
router.post('/', authenticateJWT, authorizeRoles('admin'), createProduct);
router.put('/:id', authenticateJWT, authorizeRoles('admin'), updateProduct);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteProduct);

export default router; 
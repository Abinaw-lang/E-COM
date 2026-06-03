import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  validateAddProduct,
  validateUpdateProduct,
  handleValidationErrors
} from '../validators/validators.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, authorize('admin'), validateAddProduct, handleValidationErrors, createProduct);
router.put('/:id', protect, authorize('admin'), validateUpdateProduct, handleValidationErrors, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;

import express from 'express';
import {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

// Payment routes
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify-payment', verifyPayment);

// Admin routes
router.put('/:id', authorize('admin'), updateOrderStatus);
router.get('/admin/all', authorize('admin'), getAllOrders);

export default router;

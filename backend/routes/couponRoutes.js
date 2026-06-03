import express from 'express';
import {
  createCoupon,
  validateCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  useCoupon
} from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/validate', validateCoupon);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.get('/:id', getCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);
router.patch('/:id/use', useCoupon);

export default router;

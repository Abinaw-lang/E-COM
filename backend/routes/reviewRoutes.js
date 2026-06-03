import express from 'express';
import {
  addReview,
  getProductReviews,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import {
  validateAddReview,
  handleValidationErrors
} from '../validators/validators.js';

const router = express.Router();

// Public route
router.get('/:productId', getProductReviews);

// Protected routes
router.post('/', protect, validateAddReview, handleValidationErrors, addReview);
router.delete('/:id', protect, deleteReview);

export default router;

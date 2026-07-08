import express from 'express';
import {
  getAllJerseys,
  getJerseyById,
  createJersey,
  updateJersey,
  deleteJersey,
  getFeaturedJerseys,
  getJerseyCategories
} from '../controllers/jerseyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllJerseys);
router.get('/featured', getFeaturedJerseys);
router.get('/categories', getJerseyCategories);
router.get('/:id', getJerseyById);

router.post('/', protect, authorize('admin'), createJersey);
router.put('/:id', protect, authorize('admin'), updateJersey);
router.delete('/:id', protect, authorize('admin'), deleteJersey);

export default router;

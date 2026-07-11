import express from 'express';
import {
  getUserProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  toggleUserActive
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  validateUpdateProfile,
  validateChangePassword,
  handleValidationErrors
} from '../validators/validators.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', validateUpdateProfile, handleValidationErrors, updateProfile);
router.put('/change-password', validateChangePassword, handleValidationErrors, changePassword);

// Address routes
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

// Admin routes
router.get('/', authorize('admin'), getAllUsers);
router.patch('/:id/toggle-active', authorize('admin'), toggleUserActive);

export default router;

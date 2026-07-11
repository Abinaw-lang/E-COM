import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    getDashboardStats,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getSettings,
    saveSettings,
    sendNotification,
    getNotifications,
    getAllReviews,
    toggleHideReview,
    deleteReviewAdmin,
    bulkDeleteProducts
} from '../controllers/adminController.js';

const router = express.Router();

// All routes here require auth and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Settings
router.get('/settings', getSettings);
router.post('/settings', saveSettings);

// Notifications
router.post('/notifications', sendNotification);
router.get('/notifications', getNotifications);

// Reviews
router.get('/reviews', getAllReviews);
router.patch('/reviews/:id/toggle-hide', toggleHideReview);
router.delete('/reviews/:id', deleteReviewAdmin);

// Products Bulk actions
router.post('/products/bulk-delete', bulkDeleteProducts);

export default router;

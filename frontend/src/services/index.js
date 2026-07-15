import api from './api';

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken })
};

// User Services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  getAllUsers: () => api.get('/users'),
  toggleUserActive: (id) => api.patch(`/users/${id}/toggle-active`)
};

// Product Services
export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  uploadProductImage: (data) => api.post('/products/upload-image', data),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories')
};

// Jersey Services
export const jerseyService = {
  getAllJerseys: (params) => api.get('/jerseys', { params }),
  getJerseyById: (id) => api.get(`/jerseys/${id}`),
  createJersey: (data) => api.post('/jerseys', data),
  updateJersey: (id, data) => api.put(`/jerseys/${id}`, data),
  deleteJersey: (id) => api.delete(`/jerseys/${id}`),
  getFeaturedJerseys: () => api.get('/jerseys/featured'),
  getCategories: () => api.get('/jerseys/categories')
};

// Cart Services
export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateCartItem: (productId, data) => api.put(`/cart/items/${productId}`, data),
  removeFromCart: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart')
};

// Wishlist Services
export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (data) => api.post('/wishlist/add', data),
  removeFromWishlist: (productId) => api.delete(`/wishlist/items/${productId}`)
};

// Order Services
export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createRazorpayOrder: (data) => api.post('/orders/razorpay/create-order', data),
  verifyPayment: (data) => api.post('/orders/razorpay/verify-payment', data),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}`, data),
  getAllOrders: () => api.get('/orders/admin/all')
};

// Review Services
export const reviewService = {
  getProductReviews: (productId) => api.get(`/reviews/${productId}`),
  addReview: (data) => api.post('/reviews', data),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};

// Coupon Services
export const couponService = {
  getAllCoupons: () => api.get('/coupons'),
  createCoupon: (data) => api.post('/coupons', data),
  updateCoupon: (id, data) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`)
};

// Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getSettings: () => api.get('/admin/settings'),
  saveSettings: (data) => api.post('/admin/settings', data),
  sendNotification: (data) => api.post('/admin/notifications', data),
  getNotifications: () => api.get('/admin/notifications'),
  getAllReviews: () => api.get('/admin/reviews'),
  toggleHideReview: (id) => api.patch(`/admin/reviews/${id}/toggle-hide`),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
  bulkDeleteProducts: (ids) => api.post('/admin/products/bulk-delete', { ids })
};

// Firestore helper (client-side)
export * as firestoreService from './firestore';

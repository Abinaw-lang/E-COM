import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';
import { admin } from '../config/firebase.js';

// Protect Routes - Check if user is authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorHandler('Not authorized to access this route', 401));
  }

  try {
    // Try JWT first (existing implementation)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return next(new ErrorHandler('User not found', 404));
      }

      return next();
    } catch (jwtErr) {
      // If JWT verification fails, try Firebase token verification
      if (admin && process.env.USE_FIREBASE === 'true') {
        try {
          const decoded = await admin.auth().verifyIdToken(token);
          // Attach a minimal user object for downstream controllers
          req.user = { id: decoded.uid, email: decoded.email, firebase: true };
          return next();
        } catch (fbErr) {
          return next(new ErrorHandler('Not authorized to access this route', 401));
        }
      }

      return next(new ErrorHandler('Not authorized to access this route', 401));
    }
  } catch (error) {
    return next(new ErrorHandler('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`User role '${req.user.role}' is not authorized`, 403)
      );
    }
    next();
  };
};

export { protect, authorize };

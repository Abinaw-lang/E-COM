import Coupon from '../models/Coupon.js';
import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res, next) => {
  const { code, discountType, discountValue, minOrderAmount, maxUses, expiryDate } = req.body;

  // Check if coupon already exists
  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    return next(new ErrorHandler('Coupon code already exists', 400));
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minOrderAmount: minOrderAmount || 0,
    maxUses: maxUses || null,
    expiryDate,
    isActive: true
  });

  res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: coupon
  });
});

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, orderAmount } = req.body;

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    expiryDate: { $gte: new Date() }
  });

  if (!coupon) {
    return next(new ErrorHandler('Invalid or expired coupon code', 400));
  }

  // Check minimum order amount
  if (orderAmount < coupon.minOrderAmount) {
    return next(
      new ErrorHandler(
        `Minimum order amount should be ₹${coupon.minOrderAmount}`,
        400
      )
    );
  }

  // Check max uses
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return next(new ErrorHandler('Coupon usage limit exceeded', 400));
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
  } else {
    discountAmount = coupon.discountValue;
  }

  res.status(200).json({
    success: true,
    message: 'Coupon is valid',
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount: orderAmount - discountAmount
    }
  });
});

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getAllCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: coupons.length,
    data: coupons
  });
});

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorHandler('Coupon not found', 404));
  }

  res.status(200).json({
    success: true,
    data: coupon
  });
});

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorHandler('Coupon not found', 404));
  }

  const { code, discountType, discountValue, minOrderAmount, maxUses, expiryDate, isActive } = req.body;

  // Check if new code already exists
  if (code && code !== coupon.code) {
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return next(new ErrorHandler('Coupon code already exists', 400));
    }
  }

  coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code ? code.toUpperCase() : coupon.code,
      discountType: discountType || coupon.discountType,
      discountValue: discountValue || coupon.discountValue,
      minOrderAmount: minOrderAmount !== undefined ? minOrderAmount : coupon.minOrderAmount,
      maxUses: maxUses !== undefined ? maxUses : coupon.maxUses,
      expiryDate: expiryDate || coupon.expiryDate,
      isActive: isActive !== undefined ? isActive : coupon.isActive
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Coupon updated successfully',
    data: coupon
  });
});

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    return next(new ErrorHandler('Coupon not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Coupon deleted successfully'
  });
});

// @desc    Increment coupon usage
// @route   PATCH /api/coupons/:id/use
// @access  Private
const useCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { $inc: { usedCount: 1 } },
    { new: true }
  );

  if (!coupon) {
    return next(new ErrorHandler('Coupon not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Coupon usage updated',
    data: coupon
  });
});

export {
  createCoupon,
  validateCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  useCoupon
};

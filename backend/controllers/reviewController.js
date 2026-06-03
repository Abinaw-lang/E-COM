import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
const addReview = asyncHandler(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  // Check if user has purchased this product
  const order = await Order.findOne({
    userId: req.user.id,
    'products.productId': productId,
    paymentStatus: 'completed'
  });

  if (!order) {
    return next(new ErrorHandler('You can only review products you have purchased', 403));
  }

  // Check if user already reviewed
  const existingReview = await Review.findOne({
    userId: req.user.id,
    productId
  });

  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
    await existingReview.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: existingReview
    });
  } else {
    // Create new review
    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      comment,
      verifiedPurchase: true
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  }

  // Recalculate product rating
  const reviews = await Review.find({ productId });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, { rating: avgRating });
});

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name');

  res.status(200).json({
    success: true,
    data: reviews
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorHandler('Review not found', 404));
  }

  if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHandler('Not authorized to delete this review', 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  // Recalculate product rating
  const reviews = await Review.find({ productId: review.productId });
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  await Product.findByIdAndUpdate(review.productId, { rating: avgRating });

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

export { addReview, getProductReviews, deleteReview };

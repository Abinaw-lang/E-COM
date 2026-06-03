import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products.productId');

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
  }

  res.status(200).json({
    success: true,
    data: wishlist
  });
});

// @desc    Add to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  let wishlist = await Wishlist.findOne({ userId: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId: req.user.id,
      products: [{ productId }]
    });
  } else {
    const itemExists = wishlist.products.some((item) => item.productId.toString() === productId);

    if (!itemExists) {
      wishlist.products.push({ productId });
    }
  }

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist',
    data: wishlist
  });
});

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/items/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ userId: req.user.id });

  if (!wishlist) {
    return next(new ErrorHandler('Wishlist not found', 404));
  }

  wishlist.products = wishlist.products.filter((item) => item.productId.toString() !== productId);

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    data: wishlist
  });
});

export { getWishlist, addToWishlist, removeFromWishlist };

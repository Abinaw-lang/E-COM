import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');

  if (!cart) {
    cart = await Cart.create({ userId: req.user.id, products: [] });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      userId: req.user.id,
      products: [{ productId, quantity, price: product.price, image: product.images[0]?.url }]
    });
  } else {
    const itemIndex = cart.products.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity, price: product.price, image: product.images[0]?.url });
    }
  }

  // Calculate total price
  cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: cart
  });
});

// @desc    Update cart item
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    return next(new ErrorHandler('Cart not found', 404));
  }

  const itemIndex = cart.products.findIndex((item) => item.productId.toString() === productId);

  if (itemIndex === -1) {
    return next(new ErrorHandler('Item not found in cart', 404));
  }

  if (quantity <= 0) {
    cart.products.splice(itemIndex, 1);
  } else {
    cart.products[itemIndex].quantity = quantity;
  }

  cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart updated',
    data: cart
  });
});

// @desc    Remove from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    return next(new ErrorHandler('Cart not found', 404));
  }

  cart.products = cart.products.filter((item) => item.productId.toString() !== productId);
  cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: cart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { products: [], totalPrice: 0 },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Cart cleared'
  });
});

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };

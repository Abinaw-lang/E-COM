import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Razorpay from 'razorpay';
import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../services/emailService.js';
import crypto from 'crypto';

let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} catch (error) {
  console.warn('Razorpay initialization warning:', error.message);
  razorpay = null;
}

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res, next) => {
  const { products, shippingAddress, billingAddress, couponCode } = req.body;

  if (!products || products.length === 0) {
    return next(new ErrorHandler('No products in order', 400));
  }

  let totalAmount = 0;
  const orderProducts = [];

  // Calculate total and fetch product details
  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return next(new ErrorHandler(`Product ${item.productId} not found`, 404));
    }

    if (product.stock < item.quantity) {
      return next(new ErrorHandler(`Product ${product.title} is out of stock`, 400));
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    orderProducts.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0]?.url
    });
  }

  // Apply coupon if provided
  let discount = 0;
  if (couponCode) {
    // TODO: Implement coupon validation
  }

  const order = await Order.create({
    userId: req.user.id,
    products: orderProducts,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    totalAmount: totalAmount - discount,
    discount,
    couponCode,
    paymentStatus: 'pending',
    orderStatus: 'pending'
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// @desc    Create Razorpay order
// @route   POST /api/orders/razorpay/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const { amount, orderId } = req.body;

  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `receipt_${orderId}`,
    payment_capture: 1
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      data: razorpayOrder
    });
  } catch (error) {
    return next(new ErrorHandler('Failed to create Razorpay order', 500));
  }
});

// @desc    Verify payment
// @route   POST /api/orders/razorpay/verify-payment
// @access  Private
const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    // Payment verified
    const order = await Order.findOneAndUpdate(
      { _id: req.body.orderId },
      {
        paymentStatus: 'completed',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        orderStatus: 'confirmed'
      },
      { new: true }
    );

    // Update product stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { products: [], totalPrice: 0 }
    );

    // Get user for email
    const user = await User.findById(req.user.id);

    // Send order confirmation email
    const orderDetails = {
      orderId: order._id,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      products: order.products.map(p => ({
        name: p.title,
        quantity: p.quantity,
        price: p.price
      })),
      shippingAddress: order.shippingAddress
    };
    await sendOrderConfirmationEmail(user.email, user.name, orderDetails);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });
  } else {
    await Order.findByIdAndUpdate(req.body.orderId, { paymentStatus: 'failed' });
    return next(new ErrorHandler('Payment verification failed', 400));
  }
});

// @desc    Get all orders (user)
// @route   GET /api/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Check if user is authorized
  if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHandler('Not authorized to access this order', 403));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderStatus, trackingNumber } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus, trackingNumber },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Send status update email
  const user = await User.findById(order.userId);
  if (user && ['shipped', 'delivered', 'cancelled'].includes(orderStatus)) {
    await sendOrderStatusEmail(user.email, user.name, order._id, orderStatus);
  }

  res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    data: order
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

export {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};

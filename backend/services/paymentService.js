import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in paise (smallest currency unit)
 * @param {string} orderId - Unique order ID from DB
 */
export const createRazorpayOrder = async (amount, orderId) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      payment_capture: 1 // Auto-capture payments
    };

    const order = await razorpay.orders.create(options);

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} razorpayOrderId - Order ID from Razorpay
 * @param {string} razorpayPaymentId - Payment ID from Razorpay
 * @param {string} razorpaySignature - Signature from Razorpay
 */
export const verifyPaymentSignature = (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  try {
    // Create the expected signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // Compare signatures
    const isValid = generatedSignature === razorpaySignature;

    return {
      success: isValid,
      message: isValid ? 'Payment verified' : 'Invalid signature'
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Fetch payment details from Razorpay
 */
export const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);

    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        createdAt: payment.created_at
      }
    };
  } catch (error) {
    console.error('Payment fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create a refund
 */
export const createRefund = async (paymentId, amount = null) => {
  try {
    const options = {
      payment_id: paymentId
    };

    if (amount) {
      options.amount = Math.round(amount * 100); // Convert to paise
    }

    const refund = await razorpay.payments.refund(paymentId, options);

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status
    };
  } catch (error) {
    console.error('Refund creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify webhook signature from Razorpay
 */
export const verifyWebhookSignature = (body, signature) => {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(body))
      .digest('hex');

    const isValid = generatedSignature === signature;

    return {
      success: isValid,
      message: isValid ? 'Webhook verified' : 'Invalid webhook signature'
    };
  } catch (error) {
    console.error('Webhook verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  createRazorpayOrder,
  verifyPaymentSignature,
  fetchPaymentDetails,
  createRefund,
  verifyWebhookSignature
};

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send email notification
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML body
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send registration welcome email
 */
export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to ShopHub!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering with us. We're excited to have you on board!</p>
      <p>You can now browse our amazing collection of products and enjoy a seamless shopping experience.</p>
      <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Start Shopping
      </a>
      <p>If you have any questions, feel free to contact us at ${process.env.EMAIL_USER}</p>
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply directly.</p>
    </div>
  `;

  return sendEmail(email, 'Welcome to ShopHub - Registration Successful', html);
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #ff6b6b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Reset Password
      </a>
      <p><strong>Link expires in 1 hour</strong></p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply directly.</p>
    </div>
  `;

  return sendEmail(email, 'Password Reset Request - ShopHub', html);
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (email, name, orderDetails) => {
  const {
    orderId,
    totalAmount,
    paymentStatus,
    products,
    shippingAddress
  } = orderDetails;

  const productsList = products
    .map(p => `<tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 10px;">${p.name}</td>
      <td style="padding: 10px; text-align: center;">${p.quantity}</td>
      <td style="padding: 10px; text-align: right;">₹${p.price}</td>
    </tr>`)
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p>Hello ${name},</p>
      <p>Thank you for your order! Here are your order details:</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Payment Status:</strong> <span style="color: ${paymentStatus === 'paid' ? 'green' : 'orange'};">${paymentStatus.toUpperCase()}</span></p>
        <p><strong>Shipping Address:</strong></p>
        <p style="margin-left: 20px;">
          ${shippingAddress.fullName}<br>
          ${shippingAddress.address}<br>
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
          ${shippingAddress.phone}
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: center;">Quantity</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${productsList}
          <tr style="background-color: #f0f0f0; font-weight: bold;">
            <td colspan="2" style="padding: 10px; text-align: right;">Total:</td>
            <td style="padding: 10px; text-align: right;">₹${totalAmount}</td>
          </tr>
        </tbody>
      </table>

      <p>You can track your order in your <a href="${process.env.FRONTEND_URL}/user/orders">account dashboard</a>.</p>
      <p>Thank you for shopping with ShopHub!</p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply directly.</p>
    </div>
  `;

  return sendEmail(email, `Order Confirmation - ShopHub (Order #${orderId})`, html);
};

/**
 * Send order status update email
 */
export const sendOrderStatusEmail = async (email, name, orderId, status) => {
  const statusMessages = {
    processing: 'Your order is being processed',
    shipped: 'Your order has been shipped!',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled'
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Status Update</h2>
      <p>Hello ${name},</p>
      <p>${statusMessages[status]}</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> <span style="color: ${status === 'delivered' ? 'green' : 'blue'};">${status.toUpperCase()}</span></p>
      </div>

      <p>Track your order in your <a href="${process.env.FRONTEND_URL}/user/orders/${orderId}">account dashboard</a>.</p>
      <p>Thank you for shopping with ShopHub!</p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply directly.</p>
    </div>
  `;

  return sendEmail(email, `Order Status Update - ShopHub (Order #${orderId})`, html);
};

/**
 * Send review notification to admin
 */
export const sendReviewNotificationEmail = async (reviewDetails) => {
  const { productName, reviewerName, rating, comment } = reviewDetails;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Review Received</h2>
      <p>A new review has been posted on ${productName}</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Reviewer:</strong> ${reviewerName}</p>
        <p><strong>Rating:</strong> ${'⭐'.repeat(rating)}</p>
        <p><strong>Review:</strong></p>
        <p style="color: #666;">${comment}</p>
      </div>

      <p>Log in to your <a href="${process.env.FRONTEND_URL}/admin">admin dashboard</a> to manage reviews.</p>
      
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply directly.</p>
    </div>
  `;

  return sendEmail(process.env.ADMIN_EMAIL, 'New Review Notification', html);
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendReviewNotificationEmail
};

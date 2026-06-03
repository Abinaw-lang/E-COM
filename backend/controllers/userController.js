import User from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check if old password matches
  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorHandler('Current password is incorrect', 400));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res, next) => {
  const { street, city, state, zipCode, country } = req.body;

  const user = await User.findById(req.user.id);

  user.addresses.push({
    street,
    city,
    state,
    zipCode,
    country
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: user
  });
});

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { street, city, state, zipCode, country } = req.body;

  const user = await User.findById(req.user.id);

  const address = user.addresses.id(id);
  if (!address) {
    return next(new ErrorHandler('Address not found', 404));
  }

  address.street = street || address.street;
  address.city = city || address.city;
  address.state = state || address.state;
  address.zipCode = zipCode || address.zipCode;
  address.country = country || address.country;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: user
  });
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(req.user.id);

  const address = user.addresses.id(id);
  if (!address) {
    return next(new ErrorHandler('Address not found', 404));
  }

  user.addresses.pull(id);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
    data: user
  });
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ role: 'user' });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

export {
  getUserProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers
};

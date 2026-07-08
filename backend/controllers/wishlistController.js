import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';
import { firestore } from '../config/firebase.js';
import admin from 'firebase-admin';

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res, next) => {
  // If using Firestore (client-side uses Firestore), return Firestore-based wishlist
  if (process.env.USE_FIREBASE === 'true') {
    const uid = req.user.id;
    const snap = await firestore.collection('wishlists').where('uid', '==', uid).get();
    const products = snap.docs.map((d) => ({ id: d.id, product: d.data().product }));
    return res.status(200).json({ success: true, data: { products } });
  }

  let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products.productId');

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
  }

  res.status(200).json({ success: true, data: wishlist });
});

// @desc    Add to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  if (process.env.USE_FIREBASE === 'true') {
    const uid = req.user.id;
    // Try to fetch product details from Firestore products collection
    let productData = null;
    try {
      const prodDoc = await firestore.collection('products').doc(productId).get();
      if (prodDoc.exists) productData = prodDoc.data();
    } catch (err) {
      // ignore
    }

    // fallback to Mongo product
    if (!productData) {
      const product = await Product.findById(productId);
      if (!product) return next(new ErrorHandler('Product not found', 404));
      productData = product.toObject();
    }

    await firestore.collection('wishlists').add({ uid, productId, product: productData, createdAt: admin.firestore.FieldValue.serverTimestamp() });

    const snap = await firestore.collection('wishlists').where('uid', '==', uid).get();
    const products = snap.docs.map((d) => ({ id: d.id, product: d.data().product }));
    return res.status(200).json({ success: true, message: 'Product added to wishlist', data: { products } });
  }

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
  if (process.env.USE_FIREBASE === 'true') {
    const uid = req.user.id;
    const snap = await firestore.collection('wishlists').where('uid', '==', uid).where('productId', '==', productId).get();
    if (snap.empty) return next(new ErrorHandler('Wishlist item not found', 404));
    const deletes = snap.docs.map((d) => firestore.collection('wishlists').doc(d.id).delete());
    await Promise.all(deletes);

    const newSnap = await firestore.collection('wishlists').where('uid', '==', uid).get();
    const products = newSnap.docs.map((d) => ({ id: d.id, product: d.data().product }));
    return res.status(200).json({ success: true, message: 'Product removed from wishlist', data: { products } });
  }

  const wishlist = await Wishlist.findOne({ userId: req.user.id });

  if (!wishlist) {
    return next(new ErrorHandler('Wishlist not found', 404));
  }

  wishlist.products = wishlist.products.filter((item) => item.productId.toString() !== productId);

  await wishlist.save();

  res.status(200).json({ success: true, message: 'Product removed from wishlist', data: wishlist });
});

export { getWishlist, addToWishlist, removeFromWishlist };

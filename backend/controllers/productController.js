import Product from '../models/Product.js';
import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';
import productDao from '../daos/productDao.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = asyncHandler(async (req, res, next) => {
  const { category, minPrice, maxPrice, search, sort, page = 1, limit = 10 } = req.query;

  // If Firestore enabled, use DAO (simple in-memory filtering/pagination)
  if (process.env.USE_FIREBASE === 'true') {
    const docs = await productDao.getAll();
    // apply filters in memory
    let filtered = docs.filter((p) => p.isActive !== false);
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (minPrice) filtered = filtered.filter((p) => (p.discountPrice || p.price) >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => (p.discountPrice || p.price) <= Number(maxPrice));
    if (search) filtered = filtered.filter((p) => (p.title || '').toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase()));

    const totalCount = filtered.length;
    // sorting
    if (sort) {
      const [field, order] = sort.split(':');
      filtered.sort((a, b) => {
        const av = a[field] ?? 0;
        const bv = b[field] ?? 0;
        return order === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
      });
    }

    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + Number(limit));

    return res.status(200).json({ success: true, data: paged, pagination: { total: totalCount, page: Number(page), pages: Math.ceil(totalCount / limit), limit: Number(limit) } });
  }

  // MongoDB logic
  let filter = { isActive: true };

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const sortObj = {};
  if (sort) {
    const [field, order] = sort.split(':');
    sortObj[field] = order === 'desc' ? -1 : 1;
  } else {
    sortObj.createdAt = -1;
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .sort(sortObj)
    .limit(limit)
    .skip(skip);

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit)
    }
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res, next) => {
  if (process.env.USE_FIREBASE === 'true') {
    const product = await productDao.getById(req.params.id);
    if (!product) return next(new ErrorHandler('Product not found', 404));
    return res.status(200).json({ success: true, data: product });
  }

  const product = await Product.findById(req.params.id).populate('reviews.userId', 'name');

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  res.status(200).json({ success: true, data: product });
});

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res, next) => {
  const { title, description, category, price, discountPrice, stock, images } = req.body;
  if (process.env.USE_FIREBASE === 'true') {
    const data = { title, description, category, price, discountPrice, stock, images: images || [], isActive: true };
    const product = await productDao.create(data);
    return res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  }

  const product = await Product.create({ title, description, category, price, discountPrice, stock, images: images || [] });

  res.status(201).json({ success: true, message: 'Product created successfully', data: product });
});

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (process.env.USE_FIREBASE === 'true') {
    const existing = await productDao.getById(id);
    if (!existing) return next(new ErrorHandler('Product not found', 404));
    const updated = await productDao.update(id, req.body);
    return res.status(200).json({ success: true, message: 'Product updated successfully', data: updated });
  }

  let product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
});

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (process.env.USE_FIREBASE === 'true') {
    const existing = await productDao.getById(id);
    if (!existing) return next(new ErrorHandler('Product not found', 404));
    await productDao.remove(id);
    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  }

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  await Product.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res, next) => {
  if (process.env.USE_FIREBASE === 'true') {
    const products = await productDao.getFeatured(6);
    return res.status(200).json({ success: true, data: products });
  }

  let products = await Product.find({ isFeatured: true, isActive: true }).limit(6);

  if (products.length === 0) {
    products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(6);
  }

  res.status(200).json({ success: true, data: products });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res, next) => {
  if (process.env.USE_FIREBASE === 'true') {
    const categories = await productDao.distinctCategories();
    return res.status(200).json({ success: true, data: categories });
  }

  const categories = await Product.distinct('category');

  res.status(200).json({ success: true, data: categories });
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories
};

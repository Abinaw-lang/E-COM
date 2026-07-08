import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';
import jerseyDao from '../daos/jerseyDao.js';

const getAllJerseys = asyncHandler(async (req, res, next) => {
  if (process.env.USE_FIREBASE === 'true') {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 10 } = req.query;
    let jerseys = await jerseyDao.getAll();

    if (category) jerseys = jerseys.filter((item) => item.category === category);
    if (search) jerseys = jerseys.filter((item) => (item.title || '').toLowerCase().includes(search.toLowerCase()) || (item.description || '').toLowerCase().includes(search.toLowerCase()));
    if (minPrice) jerseys = jerseys.filter((item) => (item.discountPrice || item.price) >= Number(minPrice));
    if (maxPrice) jerseys = jerseys.filter((item) => (item.discountPrice || item.price) <= Number(maxPrice));

    if (sort) {
      const [field, order] = sort.split(':');
      jerseys.sort((a, b) => {
        const av = a[field] ?? 0;
        const bv = b[field] ?? 0;
        return order === 'desc' ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
      });
    }

    const total = jerseys.length;
    const start = (Number(page) - 1) * Number(limit);
    const paged = jerseys.slice(start, start + Number(limit));

    return res.status(200).json({ success: true, data: paged, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)), limit: Number(limit) } });
  }

  return next(new ErrorHandler('Firestore only endpoint. Set USE_FIREBASE=true to use jersey datastore.', 400));
});

const getJerseyById = asyncHandler(async (req, res, next) => {
  if (process.env.USE_FIREBASE === 'true') {
    const jersey = await jerseyDao.getById(req.params.id);
    if (!jersey) return next(new ErrorHandler('Jersey not found', 404));
    return res.status(200).json({ success: true, data: jersey });
  }

  return next(new ErrorHandler('Firestore only endpoint. Set USE_FIREBASE=true to use jersey datastore.', 400));
});

const createJersey = asyncHandler(async (req, res, next) => {
  if (process.env.USE_FIREBASE === 'true') {
    const jersey = await jerseyDao.create(req.body);
    return res.status(201).json({ success: true, message: 'Jersey created successfully', data: jersey });
  }

  return next(new ErrorHandler('Firestore only endpoint. Set USE_FIREBASE=true to use jersey datastore.', 400));
});

const updateJersey = asyncHandler(async (req, res, next) => {
  if (process.env.USE_FIREBASE === 'true') {
    const existing = await jerseyDao.getById(req.params.id);
    if (!existing) return next(new ErrorHandler('Jersey not found', 404));
    const updated = await jerseyDao.update(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Jersey updated successfully', data: updated });
  }

  return next(new ErrorHandler('Firestore only endpoint. Set USE_FIREBASE=true to use jersey datastore.', 400));
});

const deleteJersey = asyncHandler(async (req, res, next) => {
  if (process.env.USE_FIREBASE === 'true') {
    const existing = await jerseyDao.getById(req.params.id);
    if (!existing) return next(new ErrorHandler('Jersey not found', 404));
    await jerseyDao.remove(req.params.id);
    return res.status(200).json({ success: true, message: 'Jersey deleted successfully' });
  }

  return next(new ErrorHandler('Firestore only endpoint. Set USE_FIREBASE=true to use jersey datastore.', 400));
});

const getFeaturedJerseys = asyncHandler(async (req, res, next) => {
  if (process.env.USE_FIREBASE === 'true') {
    const jerseys = await jerseyDao.getFeatured(6);
    return res.status(200).json({ success: true, data: jerseys });
  }

  return next(new ErrorHandler('Firestore only endpoint. Set USE_FIREBASE=true to use jersey datastore.', 400));
});

const getJerseyCategories = asyncHandler(async (req, res, next) => {
  if (process.env.USE_FIREBASE === 'true') {
    const categories = await jerseyDao.distinctCategories();
    return res.status(200).json({ success: true, data: categories });
  }

  return next(new ErrorHandler('Firestore only endpoint. Set USE_FIREBASE=true to use jersey datastore.', 400));
});

export {
  getAllJerseys,
  getJerseyById,
  createJersey,
  updateJersey,
  deleteJersey,
  getFeaturedJerseys,
  getJerseyCategories
};

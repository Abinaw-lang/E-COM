import asyncHandler from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/errorHandler.js';
import { firestore, admin } from '../config/firebase.js';

// MongoDB Models (Fallback)
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

// --- DASHBOARD STATS ---
export const getDashboardStats = asyncHandler(async (req, res, next) => {
    let products = [];
    let orders = [];
    let customersCount = 0;
    let reviewsCount = 0;

    if (process.env.USE_FIREBASE === 'true') {
        // Firebase Firestore queries
        const prodSnap = await firestore.collection('products').get();
        products = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const orderSnap = await firestore.collection('orders').get();
        orders = orderSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const userSnap = await firestore.collection('users').where('role', '==', 'user').get();
        customersCount = userSnap.size;

        const revSnap = await firestore.collection('reviews').get();
        reviewsCount = revSnap.size;
    } else {
        // MongoDB queries
        products = await Product.find({});
        orders = await Order.find({});
        customersCount = await User.countDocuments({ role: 'user' });
        reviewsCount = await Review.countDocuments({});
    }

    // Calculate statistics
    const totalProducts = products.length;
    const totalOrders = orders.length;

    // Total Revenue: sum of completed orders
    const completedOrders = orders.filter(o => o.paymentStatus === 'completed' || o.orderStatus === 'delivered');
    const revenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Pending Orders: count of orders with pending status
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;

    // Low Stock Products: stock <= 5
    const lowStockProducts = products.filter(p => (p.stock ?? 0) <= 5);

    // Recent Orders: sort orders by createdAt desc and take first 8
    const sortedOrders = [...orders].sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
        return timeB - timeA;
    });
    const recentOrders = sortedOrders.slice(0, 8);

    // Sales Chart Data (group revenue by last 6 months or 7 days)
    // Let's group by month for the last 6 months
    const monthlyData = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        monthlyData[label] = { month: label, sales: 0, orders: 0 };
    }

    // Populate data
    completedOrders.forEach(order => {
        const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        const label = `${monthNames[orderDate.getMonth()]} ${orderDate.getFullYear().toString().slice(-2)}`;
        if (monthlyData[label]) {
            monthlyData[label].sales += (order.totalAmount || 0);
            monthlyData[label].orders += 1;
        }
    });

    const chartData = Object.values(monthlyData);

    res.status(200).json({
        success: true,
        data: {
            totalProducts,
            totalOrders,
            totalCustomers: customersCount,
            revenue,
            pendingOrders,
            lowStockCount: lowStockProducts.length,
            lowStockProducts: lowStockProducts.slice(0, 5).map(p => ({
                id: p.id || p._id,
                title: p.title,
                stock: p.stock,
                price: p.price
            })),
            recentOrders,
            chartData
        }
    });
});


// --- CATEGORIES MANAGEMENT ---
export const getCategories = asyncHandler(async (req, res, next) => {
    if (process.env.USE_FIREBASE === 'true') {
        const snap = await firestore.collection('categories').get();
        const categories = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return res.status(200).json({ success: true, data: categories });
    }

    // Fallback: get distinct categories from products if no collection
    const categories = await Product.distinct('category');
    const catList = categories.map((cat, i) => ({ id: i.toString(), name: cat, isActive: true }));
    res.status(200).json({ success: true, data: catList });
});

export const createCategory = asyncHandler(async (req, res, next) => {
    const { name, description, imageUrl } = req.body;
    if (!name) return next(new ErrorHandler('Category name is required', 400));

    if (process.env.USE_FIREBASE === 'true') {
        const ref = await firestore.collection('categories').add({
            name,
            description: description || '',
            imageUrl: imageUrl || '',
            isActive: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        const doc = await ref.get();
        return res.status(201).json({ success: true, data: { id: doc.id, ...doc.data() } });
    }

    res.status(201).json({ success: true, data: { id: Date.now().toString(), name, description, imageUrl, isActive: true } });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, imageUrl, isActive } = req.body;

    if (process.env.USE_FIREBASE === 'true') {
        const ref = firestore.collection('categories').doc(id);
        const doc = await ref.get();
        if (!doc.exists) return next(new ErrorHandler('Category not found', 404));

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (imageUrl !== undefined) updates.imageUrl = imageUrl;
        if (isActive !== undefined) updates.isActive = isActive;

        await ref.update(updates);
        const updated = await ref.get();
        return res.status(200).json({ success: true, data: { id: updated.id, ...updated.data() } });
    }

    res.status(200).json({ success: true, data: { id, name, description, imageUrl, isActive } });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (process.env.USE_FIREBASE === 'true') {
        const ref = firestore.collection('categories').doc(id);
        const doc = await ref.get();
        if (!doc.exists) return next(new ErrorHandler('Category not found', 404));
        await ref.delete();
        return res.status(200).json({ success: true, message: 'Category deleted successfully' });
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
});


// --- STORE SETTINGS ---
export const getSettings = asyncHandler(async (req, res, next) => {
    if (process.env.USE_FIREBASE === 'true') {
        const doc = await firestore.collection('settings').doc('store_settings').get();
        let data = {};
        if (doc.exists) {
            data = doc.data();
        } else {
            // Default initial settings
            data = {
                storeName: 'Jersey Store',
                tagline: 'Premium Sports Jerseys',
                shippingCharges: 100,
                taxPercentage: 18,
                currency: 'INR',
                contactEmail: 'support@jerseystore.com',
                contactPhone: '+919999999999',
                address: '123 Stadium Road, Sports City, India'
            };
            await firestore.collection('settings').doc('store_settings').set(data);
        }
        return res.status(200).json({ success: true, data });
    }

    // Fallback default
    res.status(200).json({
        success: true,
        data: {
            storeName: 'Jersey Store',
            tagline: 'Premium Sports Jerseys',
            shippingCharges: 100,
            taxPercentage: 18,
            currency: 'INR',
            contactEmail: 'support@jerseystore.com',
            contactPhone: '+919999999999',
            address: '123 Stadium Road, Sports City, India'
        }
    });
});

export const saveSettings = asyncHandler(async (req, res, next) => {
    const {
        storeName, tagline, logoUrl,
        shippingCharges, taxPercentage, currency,
        contactEmail, contactPhone, address
    } = req.body;

    const data = {
        storeName: storeName || 'Jersey Store',
        tagline: tagline || '',
        logoUrl: logoUrl || '',
        shippingCharges: Number(shippingCharges) || 0,
        taxPercentage: Number(taxPercentage) || 0,
        currency: currency || 'INR',
        contactEmail: contactEmail || '',
        contactPhone: contactPhone || '',
        address: address || '',
        updatedAt: new Date().toISOString()
    };

    if (process.env.USE_FIREBASE === 'true') {
        await firestore.collection('settings').doc('store_settings').set(data, { merge: true });
        return res.status(200).json({ success: true, message: 'Settings saved successfully', data });
    }

    res.status(200).json({ success: true, message: 'Settings saved successfully', data });
});


// --- NOTIFICATIONS ---
export const sendNotification = asyncHandler(async (req, res, next) => {
    const { title, message, targetAudience } = req.body;
    if (!title || !message) {
        return next(new ErrorHandler('Title and message are required', 400));
    }

    if (process.env.USE_FIREBASE === 'true') {
        const ref = await firestore.collection('notifications').add({
            title,
            message,
            targetAudience: targetAudience || 'all',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        const doc = await ref.get();
        return res.status(201).json({ success: true, message: 'Notification sent successfully', data: { id: doc.id, ...doc.data() } });
    }

    res.status(201).json({
        success: true,
        message: 'Notification sent successfully',
        data: { id: Date.now().toString(), title, message, targetAudience, createdAt: new Date() }
    });
});

export const getNotifications = asyncHandler(async (req, res, next) => {
    if (process.env.USE_FIREBASE === 'true') {
        const snap = await firestore.collection('notifications').get();
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Sort notifications by date (newest first)
        const sorted = list.sort((a, b) => {
            const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
            const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
            return timeB - timeA;
        });

        return res.status(200).json({ success: true, data: sorted });
    }
    res.status(200).json({ success: true, data: [] });
});


// --- REVIEWS MODERATION ---
export const getAllReviews = asyncHandler(async (req, res, next) => {
    if (process.env.USE_FIREBASE === 'true') {
        const snap = await firestore.collection('reviews').get();
        const reviews = [];

        // Fetch reviewer information
        for (const d of snap.docs) {
            const rev = d.data();
            let userName = 'Unknown User';
            let productTitle = 'Unknown Product';

            if (rev.userId) {
                const uDoc = await firestore.collection('users').doc(rev.userId).get();
                if (uDoc.exists) userName = uDoc.data().name || uDoc.data().email || userName;
            }

            if (rev.productId) {
                const pDoc = await firestore.collection('products').doc(rev.productId).get();
                if (pDoc.exists) productTitle = pDoc.data().title || productTitle;
            }

            reviews.push({
                id: d.id,
                _id: d.id,
                ...rev,
                userName,
                productTitle
            });
        }

        return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    }

    // MongoDB populate
    const reviews = await Review.find({});
    const populated = [];
    for (const r of reviews) {
        const userObj = await User.findById(r.userId).select('name');
        const prodObj = await Product.findById(r.productId).select('title');
        populated.push({
            ...r._doc,
            userName: userObj ? userObj.name : 'Unknown User',
            productTitle: prodObj ? prodObj.title : 'Unknown Product'
        });
    }

    res.status(200).json({ success: true, count: populated.length, data: populated });
});

export const toggleHideReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (process.env.USE_FIREBASE === 'true') {
        const ref = firestore.collection('reviews').doc(id);
        const doc = await ref.get();
        if (!doc.exists) return next(new ErrorHandler('Review not found', 404));

        const currentStatus = doc.data().isHidden || false;
        await ref.update({ isHidden: !currentStatus });
        const updated = await ref.get();
        return res.status(200).json({ success: true, message: `Review toggled to ${!currentStatus ? 'hidden' : 'visible'}`, data: { id: updated.id, ...updated.data() } });
    }

    const review = await Review.findById(id);
    if (!review) return next(new ErrorHandler('Review not found', 404));

    review.isHidden = !review.isHidden;
    await review.save();

    res.status(200).json({ success: true, message: `Review toggled to ${review.isHidden ? 'hidden' : 'visible'}`, data: review });
});

export const deleteReviewAdmin = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (process.env.USE_FIREBASE === 'true') {
        const ref = firestore.collection('reviews').doc(id);
        const doc = await ref.get();
        if (!doc.exists) return next(new ErrorHandler('Review not found', 404));

        const productId = doc.data().productId;
        await ref.delete();

        // Recalculate average rating
        const snap = await firestore.collection('reviews').where('productId', '==', productId).get();
        const reviews = snap.docs.map(d => d.data());
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        await firestore.collection('products').doc(productId).update({ rating: avgRating });

        return res.status(200).json({ success: true, message: 'Review deleted successfully' });
    }

    const review = await Review.findById(id);
    if (!review) return next(new ErrorHandler('Review not found', 404));
    const productId = review.productId;

    await Review.findByIdAndDelete(id);

    const reviews = await Review.find({ productId });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    await Product.findByIdAndUpdate(productId, { rating: avgRating });

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
});


// --- ADMIN MANAGE PRODUCT BULK DELETE & DUPLICATE ---
export const bulkDeleteProducts = asyncHandler(async (req, res, next) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return next(new ErrorHandler('Product IDs must be provided in an array', 400));
    }

    if (process.env.USE_FIREBASE === 'true') {
        const batch = firestore.batch();
        ids.forEach(id => {
            batch.delete(firestore.collection('products').doc(id));
        });
        await batch.commit();
        return res.status(200).json({ success: true, message: `Successfully deleted ${ids.length} products` });
    }

    await Product.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: `Successfully deleted ${ids.length} products` });
});

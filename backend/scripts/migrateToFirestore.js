import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import { firestore, admin } from '../config/firebase.js';
import Product from '../models/Product.js';
import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';

dotenv.config();

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Starting migration to Firestore...');

    // Products
    const products = await Product.find().lean();
    console.log(`Found ${products.length} products`);
    for (const p of products) {
      const id = p._id.toString();
      const data = { ...p };
      // remove mongoose-specific fields if any
      delete data._id;
      delete data.__v;
      await firestore.collection('products').doc(id).set({ ...data, migratedAt: admin.firestore.FieldValue.serverTimestamp() });
    }
    console.log('Products migrated');

    // Jersey products: export jersey-specific products into a separate Firestore collection
    const isJerseyProduct = (product) => {
      const category = (product.category || '').toString().toLowerCase();
      const title = (product.title || '').toString().toLowerCase();
      return category.includes('jersey') || title.includes('jersey');
    };

    const jerseyProducts = products.filter(isJerseyProduct);
    console.log(`Found ${jerseyProducts.length} jersey products to migrate`);
    for (const p of jerseyProducts) {
      const id = p._id.toString();
      const data = { ...p };
      delete data._id;
      delete data.__v;
      await firestore.collection('jerseys').doc(id).set({ ...data, migratedAt: admin.firestore.FieldValue.serverTimestamp() });
    }
    console.log('Jersey products migrated');

    // Wishlists: export each wishlist product as a separate document
    const wishlists = await Wishlist.find().populate('products.productId').lean();
    console.log(`Found ${wishlists.length} wishlist documents`);
    let wlCount = 0;
    for (const w of wishlists) {
      const uid = w.userId?.toString();
      for (const item of w.products || []) {
        const prod = item.productId ? (typeof item.productId === 'object' ? item.productId : null) : null;
        const productData = prod ? { ...prod } : { productId: item.productId };
        if (productData._id) delete productData._id;
        await firestore.collection('wishlists').add({ uid, productId: item.productId?.toString?.() || null, product: productData, createdAt: admin.firestore.FieldValue.serverTimestamp() });
        wlCount++;
      }
    }
    console.log(`Wishlists migrated (${wlCount} items)`);

    // Carts: export each cart item as a separate document
    const carts = await Cart.find().populate('products.productId').lean();
    console.log(`Found ${carts.length} cart documents`);
    let cartCount = 0;
    for (const c of carts) {
      const uid = c.userId?.toString();
      for (const item of c.products || []) {
        const prod = item.productId ? (typeof item.productId === 'object' ? item.productId : null) : null;
        const productData = prod ? { ...prod } : { productId: item.productId };
        if (productData._id) delete productData._id;
        await firestore.collection('carts').add({ uid, productId: item.productId?.toString?.() || null, product: productData, quantity: item.quantity || 1, price: item.price || productData.price || 0, image: item.image || productData.images?.[0]?.url || '', createdAt: admin.firestore.FieldValue.serverTimestamp() });
        cartCount++;
      }
    }
    console.log(`Carts migrated (${cartCount} items)`);

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

run();

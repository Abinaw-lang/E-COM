import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const productsCollection = collection(db, 'products');
const wishlistCollection = collection(db, 'wishlists');
const cartsCollection = collection(db, 'carts');
const jerseysCollection = collection(db, 'jerseys');

export const getAllProducts = async () => {
  const snap = await getDocs(productsCollection);
  return snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
};

export const getProductById = async (id) => {
  const d = await getDoc(doc(db, 'products', id));
  return d.exists() ? { _id: d.id, id: d.id, ...d.data() } : null;
};

export const getAllJerseys = async () => {
  const snap = await getDocs(jerseysCollection);
  return snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
};

export const getJerseyById = async (id) => {
  const d = await getDoc(doc(db, 'jerseys', id));
  return d.exists() ? { _id: d.id, id: d.id, ...d.data() } : null;
};

export const getWishlistForUser = async (uid) => {
  const q = query(wishlistCollection, where('uid', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addToWishlist = async (uid, product) => {
  const data = { uid, productId: product.id || product.productId, product };
  const ref = await addDoc(wishlistCollection, data);
  return { id: ref.id, ...data };
};

export const removeFromWishlist = async (wishlistId) => {
  await deleteDoc(doc(db, 'wishlists', wishlistId));
};

export const removeFromWishlistByProduct = async (uid, productId) => {
  const q = query(wishlistCollection, where('uid', '==', uid), where('productId', '==', productId));
  const snap = await getDocs(q);
  const deletes = snap.docs.map((d) => deleteDoc(doc(db, 'wishlists', d.id)));
  await Promise.all(deletes);
};

export const getCartForUser = async (uid) => {
  const q = query(cartsCollection, where('uid', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addToCart = async (uid, item) => {
  const data = { uid, ...item };
  const ref = await addDoc(cartsCollection, data);
  return { id: ref.id, ...data };
};

export const updateCartItem = async (cartItemId, updates) => {
  const ref = doc(db, 'carts', cartItemId);
  await updateDoc(ref, updates);
};

export const updateCartItemByProduct = async (uid, productId, updates) => {
  const q = query(cartsCollection, where('uid', '==', uid), where('productId', '==', productId));
  const snap = await getDocs(q);
  const ops = snap.docs.map((d) => updateDoc(doc(db, 'carts', d.id), updates));
  await Promise.all(ops);
};

export const removeFromCart = async (cartItemId) => {
  await deleteDoc(doc(db, 'carts', cartItemId));
};

export const removeFromCartByProduct = async (uid, productId) => {
  const q = query(cartsCollection, where('uid', '==', uid), where('productId', '==', productId));
  const snap = await getDocs(q);
  const deletes = snap.docs.map((d) => deleteDoc(doc(db, 'carts', d.id)));
  await Promise.all(deletes);
};

export default {
  getAllProducts,
  getProductById,
  getWishlistForUser,
  addToWishlist,
  removeFromWishlist,
  getCartForUser,
  addToCart,
  updateCartItem,
  removeFromCart
};

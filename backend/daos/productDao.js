import { firestore, admin } from '../config/firebase.js';

const collection = firestore.collection('products');

const toPojo = (doc) => ({ id: doc.id, ...doc.data() });

export const getAll = async () => {
  const snap = await collection.where('isActive', '==', true).get();
  return snap.docs.map(toPojo);
};

export const getById = async (id) => {
  const doc = await collection.doc(id).get();
  return doc.exists ? toPojo(doc) : null;
};

export const create = async (data) => {
  const ref = await collection.add({ ...data, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const doc = await ref.get();
  return toPojo(doc);
};

export const update = async (id, updates) => {
  await collection.doc(id).update({ ...updates, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const doc = await collection.doc(id).get();
  return toPojo(doc);
};

export const remove = async (id) => {
  await collection.doc(id).delete();
};

export const getFeatured = async (limit = 6) => {
  const snap = await collection.where('isFeatured', '==', true).where('isActive', '==', true).limit(limit).get();
  if (!snap.empty) return snap.docs.map(toPojo);
  const latest = await collection.where('isActive', '==', true).orderBy('createdAt', 'desc').limit(limit).get();
  return latest.docs.map(toPojo);
};

export const distinctCategories = async () => {
  const snap = await collection.get();
  const cats = new Set();
  snap.docs.forEach((d) => { const c = d.data().category; if (c) cats.add(c); });
  return Array.from(cats);
};

export default { getAll, getById, create, update, remove, getFeatured, distinctCategories };

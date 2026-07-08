import { firestore, admin } from '../config/firebase.js';

const collection = firestore.collection('reviews');

const toPojo = (doc) => ({ id: doc.id, ...doc.data() });

export const findByUserAndProduct = async (userId, productId) => {
  const snap = await collection.where('userId', '==', userId).where('productId', '==', productId).limit(1).get();
  if (snap.empty) return null;
  return toPojo(snap.docs[0]);
};

export const create = async (data) => {
  const ref = await collection.add({ ...data, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  const doc = await ref.get();
  return toPojo(doc);
};

export const update = async (id, updates) => {
  await collection.doc(id).update({ ...updates, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const doc = await collection.doc(id).get();
  return toPojo(doc);
};

export const findByProduct = async (productId) => {
  const snap = await collection.where('productId', '==', productId).get();
  return snap.docs.map(toPojo);
};

export const remove = async (id) => {
  await collection.doc(id).delete();
};

export default { findByUserAndProduct, create, update, findByProduct, remove };

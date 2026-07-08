import { firestore, admin } from '../config/firebase.js';

const collection = firestore.collection('orders');

const toPojo = (doc) => ({ id: doc.id, ...doc.data() });

export const create = async (data) => {
  const ref = await collection.add({ ...data, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const doc = await ref.get();
  return toPojo(doc);
};

export const getByUser = async (uid) => {
  const snap = await collection.where('userId', '==', uid).orderBy('createdAt', 'desc').get();
  return snap.docs.map(toPojo);
};

export const getById = async (id) => {
  const doc = await collection.doc(id).get();
  return doc.exists ? toPojo(doc) : null;
};

export const update = async (id, updates) => {
  await collection.doc(id).update({ ...updates, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const doc = await collection.doc(id).get();
  return toPojo(doc);
};

export const listAll = async () => {
  const snap = await collection.orderBy('createdAt', 'desc').get();
  return snap.docs.map(toPojo);
};

export default { create, getByUser, getById, update, listAll };

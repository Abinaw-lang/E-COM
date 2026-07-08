import { firestore, admin } from '../config/firebase.js';

const collection = firestore.collection('coupons');

const toPojo = (doc) => ({ id: doc.id, ...doc.data() });

export const create = async (data) => {
  data.code = data.code.toUpperCase();
  const ref = await collection.add({ ...data, usedCount: 0, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const doc = await ref.get();
  return toPojo(doc);
};

export const findByCode = async (code) => {
  const snap = await collection.where('code', '==', code.toUpperCase()).where('isActive', '==', true).limit(1).get();
  if (snap.empty) return null;
  return toPojo(snap.docs[0]);
};

export const listAll = async () => {
  const snap = await collection.orderBy('createdAt', 'desc').get();
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

export const remove = async (id) => {
  await collection.doc(id).delete();
};

export const incrementUse = async (id) => {
  const ref = collection.doc(id);
  await ref.update({ usedCount: admin.firestore.FieldValue.increment(1) });
  const doc = await ref.get();
  return toPojo(doc);
};

export default { create, findByCode, listAll, getById, update, remove, incrementUse };

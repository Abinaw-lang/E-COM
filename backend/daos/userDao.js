import { firestore, admin } from '../config/firebase.js';

const collection = firestore.collection('users');

const toPojo = (doc) => ({ id: doc.id, ...doc.data() });

export const getById = async (id) => {
  const doc = await collection.doc(id).get();
  return doc.exists ? toPojo(doc) : null;
};

export const getByEmail = async (email) => {
  const snap = await collection.where('email', '==', email).limit(1).get();
  if (snap.empty) return null;
  return toPojo(snap.docs[0]);
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

export const listUsers = async () => {
  const snap = await collection.where('role', '==', 'user').get();
  return snap.docs.map(toPojo);
};

export default { getById, getByEmail, create, update, listUsers };

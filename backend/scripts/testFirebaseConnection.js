import { firestore } from '../config/firebase.js';

(async () => {
  try {
    const collections = await firestore.listCollections();
    console.log('Connected to Firestore. Collections:');
    collections.forEach((c) => console.log('-', c.id));
    process.exit(0);
  } catch (err) {
    console.error('Failed to connect to Firestore:', err.message || err);
    process.exit(1);
  }
})();

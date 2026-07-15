import admin from 'firebase-admin';

const initFirebase = () => {
  try {
    const firebaseConfig = {};

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseConfig.credential = admin.credential.cert(serviceAccount);
    }

    if (process.env.FIREBASE_STORAGE_BUCKET) {
      firebaseConfig.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
    }

    if (Object.keys(firebaseConfig).length > 0) {
      admin.initializeApp(firebaseConfig);
    } else {
      // If GOOGLE_APPLICATION_CREDENTIALS or App Engine metadata is available, admin will pick it up automatically.
      admin.initializeApp();
    }

    const firestore = admin.firestore();
    return { admin, firestore };
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK:', err.message);
    throw err;
  }
};

const { firestore } = initFirebase();

export { admin, firestore };

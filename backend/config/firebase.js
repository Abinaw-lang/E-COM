import admin from 'firebase-admin';

const initFirebase = () => {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // If GOOGLE_APPLICATION_CREDENTIALS is set, admin will pick it up automatically.
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

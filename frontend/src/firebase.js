import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZm-DssvpgK1zR2ObLnviznCO0AZT6Fvo",
  authDomain: "jersey-32711.firebaseapp.com",
  projectId: "jersey-32711",
  storageBucket: "jersey-32711.firebasestorage.app",
  messagingSenderId: "878180807104",
  appId: "1:878180807104:web:d1806902527c6d37c75825",
  measurementId: "G-1T9KX3BDGW"
};

const app = initializeApp(firebaseConfig);

let analytics;
try {
  analytics = getAnalytics(app);
} catch (err) {
  analytics = null;
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
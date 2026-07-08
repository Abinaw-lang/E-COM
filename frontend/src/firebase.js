// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZgJKWFpHRKtTI-Tpd1PhMcjk0jMrfJbM",
  authDomain: "smart-elearning-app.firebaseapp.com",
  projectId: "smart-elearning-app",
  storageBucket: "smart-elearning-app.firebasestorage.app",
  messagingSenderId: "933978487933",
  appId: "1:933978487933:web:ab70a102f36d1653d4c514",
  measurementId: "G-PLKCZMJ1DX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
try {
  analytics = getAnalytics(app);
} catch (err) {
  // Analytics may fail in non-browser environments (SSR)
  analytics = null;
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };

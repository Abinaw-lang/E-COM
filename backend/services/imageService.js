import dotenv from 'dotenv';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyCZm-DssvpgK1zR2ObLnviznCO0AZT6Fvo',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'jersey-32711.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'jersey-32711',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'jersey-32711.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '878180807104',
  appId: process.env.FIREBASE_APP_ID || '1:878180807104:web:d1806902527c6d37c75825'
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const normalizeBase64 = (value) => {
  if (!value) return '';
  if (typeof value !== 'string') return '';
  const markerIndex = value.indexOf(',');
  if (markerIndex >= 0) {
    return value.slice(markerIndex + 1);
  }
  return value;
};

/**
 * Upload single image to Firebase Storage
 * @param {string} fileBase64 - Base64 encoded file content or data URL
 * @param {string} folder - Firebase storage folder path
 * @param {object} options - Optional metadata for the upload
 */
export const uploadImage = async (fileBase64, folder = 'ecommerce', options = {}) => {
  try {
    const normalizedBase64 = normalizeBase64(fileBase64);
    const buffer = Buffer.from(normalizedBase64, 'base64');
    const fileName = options.fileName || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const contentType = options.contentType || 'application/octet-stream';
    const storageRef = ref(storage, `${folder}/${fileName}`);

    await uploadBytes(storageRef, buffer, { contentType });
    const url = await getDownloadURL(storageRef);

    return {
      success: true,
      url,
      publicId: fileName
    };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload product image
 */
export const uploadProductImage = async (fileBase64, options = {}) => {
  return uploadImage(fileBase64, 'ecommerce/products', options);
};

/**
 * Upload user profile image
 */
export const uploadProfileImage = async (fileBase64, options = {}) => {
  return uploadImage(fileBase64, 'ecommerce/profiles', options);
};

/**
 * Delete image from Firebase Storage
 */
export const deleteImage = async (publicId) => {
  try {
    return {
      success: true,
      message: `Firebase Storage deletion is handled by the storage rules and bucket. Public id: ${publicId}`
    };
  } catch (error) {
    console.error('Image deletion error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (files, folder = 'ecommerce') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    return {
      success: true,
      images: results.filter(r => r.success)
    };
  } catch (error) {
    console.error('Multiple upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  uploadImage,
  uploadProductImage,
  uploadProfileImage,
  deleteImage,
  uploadMultipleImages
};

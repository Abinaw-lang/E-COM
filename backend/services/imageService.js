import dotenv from 'dotenv';
import { admin } from '../config/firebase.js';

dotenv.config();

const normalizeBase64 = (value) => {
  if (!value) return '';
  if (typeof value !== 'string') return '';
  const markerIndex = value.indexOf(',');
  if (markerIndex >= 0) {
    return value.slice(markerIndex + 1);
  }
  return value;
};

const getBucket = () => {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  return bucketName ? admin.storage().bucket(bucketName) : admin.storage().bucket();
};

const getDownloadUrl = async (file) => {
  try {
    const expiresAt = new Date('2999-12-31T23:59:59Z');
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: expiresAt
    });
    return url;
  } catch (error) {
    console.error('Failed to get signed URL:', error);
    throw error;
  }
};

/**
 * Upload single image to Firebase Storage using Firebase Admin SDK
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
    const bucket = getBucket();
    const file = bucket.file(`${folder}/${fileName}`);

    await file.save(buffer, {
      metadata: {
        contentType
      },
      resumable: false
    });

    const url = await getDownloadUrl(file);

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
export const deleteImage = async (publicId, folder = 'ecommerce') => {
  try {
    const bucket = getBucket();
    await bucket.file(`${folder}/${publicId}`).delete();
    return {
      success: true
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
    const uploadPromises = files.map((file) => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    return {
      success: true,
      images: results.filter((r) => r.success)
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

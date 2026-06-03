import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const cloudinaryURL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload single image to Cloudinary
 * @param {string} fileBase64 - Base64 encoded file
 * @param {string} folder - Cloudinary folder path
 */
export const uploadImage = async (fileBase64, folder = 'ecommerce') => {
  try {
    const formData = new FormData();
    formData.append('file', fileBase64);
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    const response = await axios.post(cloudinaryURL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      success: true,
      url: response.data.secure_url,
      publicId: response.data.public_id
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
export const uploadProductImage = async (fileBase64) => {
  return uploadImage(fileBase64, 'ecommerce/products');
};

/**
 * Upload user profile image
 */
export const uploadProfileImage = async (fileBase64) => {
  return uploadImage(fileBase64, 'ecommerce/profiles');
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (publicId) => {
  try {
    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`;

    const response = await axios.post(url, {
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    return {
      success: response.data.result === 'ok'
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

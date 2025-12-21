// src/utils/imageUpload.js

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {Function} onProgress - Optional progress callback (0-100)
 * @returns {Promise<string>} - Returns the image URL
 */
export const uploadToCloudinary = async (file, onProgress = null) => {
  // Replace these with your Cloudinary credentials
  const CLOUD_NAME = 'dzw8gr5pu'; // Get from Cloudinary dashboard
  const UPLOAD_PRESET = 'nust-connect-uploads'; // Create in Settings > Upload

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'nust-connect'); // Optional: organize in folders

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Returns HTTPS URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload multiple images
 * @param {FileList|File[]} files - Array of files
 * @returns {Promise<string[]>} - Array of image URLs
 */
export const uploadMultipleImages = async (files) => {
  const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
};

/**
 * Validate image file
 * @param {File} file
 * @param {number} maxSizeMB - Maximum file size in MB (default 5MB)
 * @returns {Object} - {valid: boolean, error: string}
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }

  // Check file size
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  return { valid: true, error: null };
};

/**
 * Compress image before upload (optional, for better performance)
 * @param {File} file
 * @param {number} maxWidth - Max width in pixels
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<File>}
 */
export const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = reject;
    };
    
    reader.onerror = reject;
  });
};

export default uploadToCloudinary;
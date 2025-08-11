/**
 * Frontend utility functions for handling file URLs
 */

/**
 * Get the base API URL from environment variables
 */
const getBaseApiUrl = () => {
  // Check if we're in production
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://api.the-eagle.fikra.solutions/api/v1';
  }
  // Development fallback
  return import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:4003/api/v1';
};

/**
 * Generate the correct file URL for the current environment
 * @param {string} filePath - The file path from the backend (e.g., '/uploads/image.jpg')
 * @param {string} subfolder - Optional subfolder (e.g., 'avatars', 'pdfs')
 * @returns {string} Complete URL to access the file
 */
export const generateFileUrl = (filePath, subfolder = '') => {
  if (!filePath) return null;
  
  // If it's already a full URL, return as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // If it's a Cloudinary URL, return as is
  if (filePath.includes('cloudinary.com') || filePath.includes('res.cloudinary.com')) {
    return filePath;
  }
  
  const baseUrl = getBaseApiUrl();
  
  // Remove leading slash if present
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  
  // Check if the path already contains uploads directory
  if (cleanPath.startsWith('uploads/')) {
    // Path already has uploads, so just append to base URL
    return `${baseUrl}/${cleanPath}`;
  }
  
  // Build the full URL
  let fullUrl;
  if (subfolder) {
    fullUrl = `${baseUrl}/uploads/${subfolder}/${cleanPath}`;
  } else {
    fullUrl = `${baseUrl}/uploads/${cleanPath}`;
  }
  
  console.log('generateFileUrl:', {
    filePath,
    subfolder,
    baseUrl,
    cleanPath,
    fullUrl
  });
  
  return fullUrl;
};

/**
 * Generate image URL specifically for course/blog/subject images
 * @param {string} secureUrl - The secure_url from the backend
 * @returns {string} Complete URL to access the image
 */
export const generateImageUrl = (secureUrl) => {
  if (!secureUrl) return null;
  
  // If it's already a full URL, return as is
  if (secureUrl.startsWith('http://') || secureUrl.startsWith('https://')) {
    return secureUrl;
  }
  
  // If it's a Cloudinary URL, return as is
  if (secureUrl.includes('cloudinary.com') || secureUrl.includes('res.cloudinary.com')) {
    return secureUrl;
  }
  
  // For local files, check if the path already contains uploads directory
  if (secureUrl.startsWith('/uploads/')) {
    // Path already has uploads, so just append to base URL
    const baseUrl = getBaseApiUrl();
    const cleanPath = secureUrl.slice(1); // Remove leading slash
    return `${baseUrl}/${cleanPath}`;
  }
  
  // For other local files, use the general file URL generator
  return generateFileUrl(secureUrl);
};

/**
 * Check if a URL is a local file that needs URL generation
 * @param {string} url 
 * @returns {boolean}
 */
export const isLocalFile = (url) => {
  if (!url) return false;
  return url.startsWith('/uploads/') || url.startsWith('uploads/');
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const menuImageSrc = (image) => image?.startsWith('/uploads/menu/')
  ? `${API_BASE_URL.replace(/\/$/, '')}${image}`
  : image;

export { API_BASE_URL, menuImageSrc };

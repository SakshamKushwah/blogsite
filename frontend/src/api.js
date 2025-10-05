import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend-blog-h5cb.onrender.com', // Removed trailing slash
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

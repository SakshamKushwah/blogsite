import axios from 'axios';

const API = axios.create({
  baseURL: 'https://blogsite-9nr5-b.vercel.app', // ✅ Deployed backend
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

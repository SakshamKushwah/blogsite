import axios from 'axios';

const API = axios.create({
  baseURL: "https://blogsite-back.vercel.app/", // ✅ Use your deployed backend URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

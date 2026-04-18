import axios from "axios";

export const api = axios.create({
  baseURL: "https://projeto-petshop-api-backend.onrender.com"
});

// Interceptor para enviar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
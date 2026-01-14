// api/axios.ts
import axios from "axios";
import { getGlobalLogout } from "../auth/authBridge";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor de request: agrega el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta: maneja 401 automáticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Llama al logout global si existe
      const logout = getGlobalLogout();
      logout?.();

      // Redirige al login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

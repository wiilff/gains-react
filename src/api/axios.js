// api.js
import axios from "axios";

let accessToken = localStorage.getItem("accessToken") || null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // important for cookies
});

// Attach access token to requests
api.interceptors.request.use((config) => {
  if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

// Handle expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint
        const res = await api.post("/api/auth/refresh");
        const newToken = res.data.token;
        setAccessToken(newToken);

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh failed, logout
        setAccessToken(null);
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
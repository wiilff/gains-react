// api.js
import axios from "axios";

// In-memory token + localStorage fallback
let accessToken = localStorage.getItem("accessToken") || null;

// Update token in memory & localStorage
export const setAccessToken = (token) => {
  accessToken = token;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
};

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // important to send HttpOnly refresh cookie
});

// Attach token to requests
api.interceptors.request.use((config) => {
  if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

// Handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip retry for auth endpoints
    const isAuthRequest = originalRequest.url.includes("/api/auth/login") ||
                          originalRequest.url.includes("/api/auth/register") ||
                          originalRequest.url.includes("/api/auth/refresh");

    if ((error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry &&
        !isAuthRequest) {

      originalRequest._retry = true;

      try {
        // Attempt refresh
        const res = await api.post("/api/auth/refresh");
        if (res.data.token) {
          setAccessToken(res.data.token);
          originalRequest.headers["Authorization"] = `Bearer ${res.data.token}`;
          return api(originalRequest);
        } else {
          throw new Error("No token returned from refresh");
        }
      } catch (err) {
        console.log("Refresh failed:", err);

        // Only log out if refresh fails for a real request
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setAccessToken(null);
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

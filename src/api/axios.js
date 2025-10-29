// ...existing code...
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

let accessToken = localStorage.getItem("accessToken") || null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// create a separate instance for refresh calls to avoid interceptor recursion
const authApi = axios.create({
    baseURL: API_URL,
    withCredentials: true
});
// ...existing code...
api.interceptors.request.use((config) => {
    if(accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config
});

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    // if the failing request is the refresh endpoint, don't try to refresh again
    if (originalRequest?.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
    }

    if(error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            // use authApi (no interceptor) to call refresh
            const res = await authApi.post("/api/auth/refresh", null);

            const newAccessToken = res.data.token;
            setAccessToken(newAccessToken);

            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            
            return api(originalRequest);

        } catch(err) {
            setAccessToken(null);
            window.location.href = "/login"
            return Promise.reject(err);
        }
    }
    return Promise.reject(error);
})

export default api;
// ...existing code...
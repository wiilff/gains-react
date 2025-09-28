import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

let accessToken = localStorage.getItem("accessToken") || null;

export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem("accessToken", token);
};

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    if(accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config
});

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if(error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const res = await api.post("/api/auth/refresh", null);

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
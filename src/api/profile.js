import api from "../api/axios"

export const getProfileData = async () => {
  const res = await api.get(`/api/workouts/exercises/stats/profile`);
  return res.data;
};

export const getMe = async () => {
    const res = await api.get("/api/user/me");
    return res.data;
}

export const createPost = async (data) => {
    const res = await api.post(`/api/posts`, data);
    return res.data;
}

export const getFeed = async () => {
    const res = await api.get("/api/posts/feed");
    return res.data;
}
import api from "../api/axios";

export const getUserProfile = async () => {
  const res = await api.get("/api/user/stats");
  return res.data;
};


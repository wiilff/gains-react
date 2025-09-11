import api, { setAccessToken } from "./api";

export const login = async (email, password) => {
  const res = await api.post("/login", { email, password });
  const { accessToken } = res.data;

  setAccessToken(accessToken);
  
};
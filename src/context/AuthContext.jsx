import { createContext, useContext, useState, useEffect } from "react";
import Loading from "../components/Loading";
import api, { setAccessToken } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const initAuth = async () => {
      try {
        const res = await api.post("/api/user/auth/refresh", null, {
          withCredentials: true,
        });
        setToken(res.data.access_token);
        setAccessToken(res.data.access_token);
        setUser(res.data.user);
      } catch (err) {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  if (loading) return <Loading />;

  const login = async (email, password) => {
    const res = await api.post("/api/user/login", { email, password });
    setToken(res.data.access_token);
    setAccessToken(res.data.access_token);
    setUser(res.data.user);
    console.log(res.data);
  };

  const register = async (name, email, password) => {
    const res = await api.post("/api/user/register", { name, email, password });
    setToken(res.data.access_token);
    setAccessToken(res.data.access_token);
    setUser(res.data.user);
    console.log(res.data);
  };

  const logout = async () => {
    try {
      await api.post("/api/user/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setToken(null);
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

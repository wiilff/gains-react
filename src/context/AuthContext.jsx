import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAccessToken } from "../api/axios";
import Loading from "../components/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Try refresh on mount
    const tryRefresh = async () => {
      try {
        const res = await api.post("/api/auth/refresh");
        if (res.data.token) {
          setAccessToken(res.data.token);
          setUser(res.data.email);
        }
      } catch (err) {
        console.log("Refresh failed:", err);
        // Don't clear token here — user might login immediately after
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  if (loading) return <Loading />;

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data.token) setAccessToken(res.data.token);
      setUser(res.data.email);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      if (res.data.token) setAccessToken(res.data.token);
      setUser(res.data.email);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setAccessToken(null);
      setUser(null);
      setLoading(false);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

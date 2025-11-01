import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import api, { setAccessToken } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await api.post("/api/auth/refresh");
        setAccessToken(res.data.token);
        setUser(res.data.email);
      } catch (err) {
        setAccessToken(null);
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
      setAccessToken(res.data.token);
      setUser(res.data.email);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setAccessToken(res.data.token);
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

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete("/api/auth");
    } catch (err) {
      console.error("Account deletion failed", err);
    } finally {
      setAccessToken(null);
      setUser(null);
      setLoading(false);
      navigate("/login");
    }
  }

  const updateAccount = async (data) => {
    setLoading(true);
    try {
      const res = await api.put("/api/auth", data);
      setUser(res.data.email);
      setAccessToken(res.data.token);
    } catch (err) {
      console.error("Account update failed", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, login, register, logout, deleteAccount, updateAccount, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

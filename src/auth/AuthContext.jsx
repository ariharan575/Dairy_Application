import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const register = async (data) => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  };

  const login = async (data) => {
    const res = await api.post("/api/auth/login", data);
    localStorage.setItem("accessToken", res.data.accessToken);
    setIsAuthenticated(true);
    await fetchProfile();
    return res.data;
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/user/profile");
      localStorage.setItem("firstName", res.data.username);
    } catch (error) {
      console.error("Failed to fetch profile");
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("accessToken");
      sessionStorage.clear();
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await api.post("/api/auth/refresh");
        if (res.data?.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
          setIsAuthenticated(true);
          await fetchProfile();
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("accessToken");
        }
      } catch (error) {
        console.error("Token refresh failed", error);
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        register,
        isAuthenticated,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
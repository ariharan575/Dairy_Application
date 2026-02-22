import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);


  const register = async (data) => {
    await api.post("/api/auth/register", data);
    sessionStorage.setItem("otpEmail", data.email);
    sessionStorage.setItem("otpUsage", "REGISTER");
    sessionStorage.setItem("firstName", data.username);
  };

  const forgetPasswordApi = (email) => {
    return api.post("/api/auth/forget-password", { email });
  };

  const verifyOtpApi = (data) => {
    return api.post("/api/auth/verify", data);
  };

  const resetPasswordApi = (data) => {
    return api.post("/api/auth/reset-password", data);
  };


  const login = async (data) => {
    const res = await api.post("/api/auth/login", data);

    localStorage.setItem("accessToken", res.data.accessToken);

    setIsAuthenticated(true);

    await fetchProfile();
  };


  const fetchProfile = async () => {
    const res = await api.get("/api/user/profile");
    localStorage.setItem("firstName", res.data.username);
  };


  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
   localStorage.removeItem("accessToken"); 
   sessionStorage.clear(); 


      setIsAuthenticated(false);

      window.location.href = "/login";
    }
  };

  // ====================================================

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem("accessToken");

      if (token) {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      try {
        const res = await api.post("/api/auth/refresh");
        localStorage.setItem("accessToken", res.data.accessToken);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ====================================================


  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        register,
        forgetPasswordApi,
        verifyOtpApi,
        resetPasswordApi,
        isAuthenticated, 
        loading     
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

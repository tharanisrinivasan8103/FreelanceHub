import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from "react";
import { loginUser, registerUser } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // LOAD AUTH DATA ON PAGE REFRESH
  // ======================================================
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Auth load error:", error);
      localStorage.clear();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================================================
  // LOGIN
  // ======================================================
  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });

      const userData = res.data.user;
      const tokenData = res.data.token;

      setUser(userData);
      setToken(tokenData);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", tokenData);

      return { success: true, role: userData.role };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid Email or Password"
      };
    }
  };

  // ======================================================
  // REGISTER
  // ======================================================
  const register = async (data) => {
    try {
      const res = await registerUser(data);
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration Failed"
      };
    }
  };

  // ======================================================
  // LOGOUT - clears everything
  // ======================================================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("platformSettings");
    // Force redirect to landing page
    window.location.href = "/";
  };

  const isAuthenticated = !!token;
  const isFreelancer = user?.role === "freelancer";
  const isClient = user?.role === "client";
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isFreelancer,
    isClient,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
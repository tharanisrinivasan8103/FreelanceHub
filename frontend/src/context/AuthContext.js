import React,
{
  createContext,
  useState,
  useEffect,
  useContext
}
from "react";

import { loginUser, registerUser } from "../api/api";


// ======================================================
// CREATE CONTEXT
// ======================================================

const AuthContext = createContext();


// ======================================================
// PROVIDER
// ======================================================

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);



  // ======================================================
  // LOAD USER FROM LOCAL STORAGE ON PAGE REFRESH
  // ======================================================

  useEffect(() => {

    const savedUser = localStorage.getItem("user");

    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {

      setUser(JSON.parse(savedUser));

      setToken(savedToken);

    }

    setLoading(false);

  }, []);




  // ======================================================
  // LOGIN FUNCTION
  // ======================================================

  const login = async (email, password) => {

    try {

      const res = await loginUser({

        email,

        password

      });

      const userData = res.data.user;

      const tokenData = res.data.token;



      // SAVE STATE

      setUser(userData);

      setToken(tokenData);



      // SAVE LOCAL STORAGE

      localStorage.setItem(

        "user",

        JSON.stringify(userData)

      );

      localStorage.setItem(

        "token",

        tokenData

      );



      return {

        success: true,

        role: userData.role,

        user: userData

      };

    }

    catch (error) {

      return {

        success: false,

        message:

          error.response?.data?.message ||

          "Invalid Email or Password"

      };

    }

  };



  // ======================================================
  // REGISTER FUNCTION
  // ======================================================

  const register = async (data) => {

    try {

      const res = await registerUser(data);

      return {

        success: true,

        message: res.data.message

      };

    }

    catch (error) {

      return {

        success: false,

        message:

          error.response?.data?.message ||

          "Registration Failed"

      };

    }

  };



  // ======================================================
  // LOGOUT FUNCTION
  // ======================================================

  const logout = () => {

    setUser(null);

    setToken(null);

    localStorage.removeItem("user");

    localStorage.removeItem("token");

  };



  // ======================================================
  // CHECK ROLE
  // ======================================================

  const isFreelancer = user?.role === "freelancer";

  const isClient = user?.role === "client";

  const isAdmin = user?.role === "admin";



  // ======================================================
  // VALUE
  // ======================================================

  const value = {

    user,

    token,

    login,

    register,

    logout,

    loading,

    isAuthenticated: !!token,

    isFreelancer,

    isClient,

    isAdmin

  };



  // ======================================================
  // PROVIDER RETURN
  // ======================================================

  return (

    <AuthContext.Provider value={value}>

      {!loading && children}

    </AuthContext.Provider>

  );

};



// ======================================================
// CUSTOM HOOK
// ======================================================

export const useAuth = () => {

  return useContext(AuthContext);

};
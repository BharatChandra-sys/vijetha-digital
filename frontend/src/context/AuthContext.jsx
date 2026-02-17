// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ======================
  // Restore session
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          email: decoded.sub,
          role: decoded.role,
        });
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  // ======================
  // Login
  // ======================
  const login = async (email, password, redirectTo = "/") => {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data.access_token;
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);

    const userData = {
      email: decoded.sub,
      role: decoded.role,
    };

    setUser(userData);

    if (userData.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate(redirectTo, { replace: true });
    }
  };

  // ======================
  // Register
  // ======================
  const register = async (name, email, password) => {
    await api.post("/auth/register", {
      name,
      email,
      password,
    });
  };

  // ======================
  // Logout
  // ======================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = {
    user,
    loading,
    login,
    register, // ✅ added
    logout,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "user_info";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (token && storedUser) {
      try {
        // Verify token is not expired before trusting stored user
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem(USER_STORAGE_KEY);
          setUser(null);
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        localStorage.clear();
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password, redirectTo = "/") => {
    const res = await api.post("/auth/login", { email, password });

    const { access_token, refresh_token, user: userInfo } = res.data;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);

    const userData = {
      id: userInfo.id,
      email: userInfo.email,
      full_name: userInfo.full_name,
      role: userInfo.role,
      iam_roles: userInfo.iam_roles || [],
      status: userInfo.status,
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);

    if (userData.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate(redirectTo, { replace: true });
    }
  };

  const register = async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    navigate("/login", { replace: true });
  };

  // Call this after a successful profile update to sync header
  const updateUserInfo = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserInfo,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
      }}
    >
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

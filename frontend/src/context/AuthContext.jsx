import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          email: decoded.sub,
          role: decoded.role,
        });
      } catch {
        localStorage.clear();
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password, redirectTo = "/") => {
    const res = await api.post("/auth/login", { email, password });

    const accessToken = res.data.access_token;
    const refreshToken = res.data.refresh_token;

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    const decoded = jwtDecode(accessToken);

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

  const register = async (name, email, password) => {
    await api.post("/auth/register", {
      name,
      email,
      password,
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
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
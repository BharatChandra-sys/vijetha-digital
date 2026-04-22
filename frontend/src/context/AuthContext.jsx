import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "user_info";

function getInitialUser() {
  const token = localStorage.getItem("access_token");
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!token || !storedUser) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [loading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password, redirectTo = "/", loginPortal = "customer") => {
    const res = await api.post("/auth/login", {
      email,
      password,
      login_portal: loginPortal,
    });

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

    // Role-based navigation
    if (userData.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (userData.iam_roles && userData.iam_roles.length > 0) {
      // Staff with IAM roles go to staff workspace
      navigate("/staff/workspace", { replace: true });
    } else {
      // Regular customers or users without IAM roles
      navigate(redirectTo, { replace: true });
    }
  };

  const loginWithGoogle = async (googleToken, redirectTo = "/", loginPortal = "customer") => {
    const res = await api.post("/auth/google", {
      google_token: googleToken,
      login_portal: loginPortal,
    });

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

    // Role-based navigation
    if (userData.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (userData.iam_roles && userData.iam_roles.length > 0) {
      // Staff with IAM roles go to staff workspace
      navigate("/staff/workspace", { replace: true });
    } else {
      // Regular customers or users without IAM roles
      navigate(redirectTo, { replace: true });
    }
  };

  const register = async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
  };

  const logout = () => {
    const wasAdmin = user?.role === "admin";
    const hadIamRoles = user?.iam_roles && user.iam_roles.length > 0;
    
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    
    // Redirect to appropriate login portal
    if (wasAdmin) {
      navigate("/admin/login", { replace: true });
    } else if (hadIamRoles) {
      navigate("/staff/login", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
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
        loginWithGoogle,
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

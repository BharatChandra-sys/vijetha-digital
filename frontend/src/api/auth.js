import api from "./axios";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const register = async (name, email, password) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  return res.data;
};

export const forgotPassword = async (email) => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token, newPassword) => {
  return api.post("/auth/reset-password", {
    token,
    new_password: newPassword,
  });
};

export const getProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/auth/me", data);
  return res.data;
};

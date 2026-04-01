// src/api/admin.js
import api from "./axios";

// ---------- DASHBOARD ----------
export const getAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

// ---------- ORDERS ----------
export const getAdminOrders = async () => {
  const res = await api.get("/admin/orders");
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.patch(`/admin/orders/${orderId}`, { status });
  return res.data;
};

// ---------- MATERIALS ----------
export const getMaterials = async () => {
  const res = await api.get("/admin/materials");
  return res.data;
};

export const addMaterial = async (data) => {
  const res = await api.post("/admin/materials", data);
  return res.data;
};

// ---------- EXTRAS ----------
export const getExtras = async () => {
  const res = await api.get("/admin/extras");
  return res.data;
};

export const addExtra = async (data) => {
  const res = await api.post("/admin/extras", data);
  return res.data;
};

// ---------- PRODUCTS ----------
export const getAdminProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post("/admin/products", data);
  return res.data;
};

export const deleteProduct = async (productId) => {
  const res = await api.delete(`/admin/products/${productId}`);
  return res.data;
};

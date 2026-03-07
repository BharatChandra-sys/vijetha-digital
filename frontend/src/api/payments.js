import api from "./axios";

export async function createPayment(orderId, payload = {}) {
  const res = await api.post(`/payments/create/${orderId}`, payload);
  return res.data;
}

export async function verifyPayment(orderId, payload) {
  const res = await api.post(`/payments/verify/${orderId}`, payload);
  return res.data;
}

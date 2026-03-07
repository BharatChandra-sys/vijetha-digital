import api from "./axios";

/**
 * Create a new order
 */
export async function placeOrder(payload) {
  const res = await api.post("/orders", payload);
  return res.data;
}

/**
 * Get logged-in user's orders
 */
export async function getMyOrders() {
  const res = await api.get("/orders");
  return res.data;
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId) {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
}

/**
 * Download PDF invoice for an order
 */
export async function downloadInvoice(orderId) {
  const res = await api.get(`/orders/${orderId}/invoice`, {
    responseType: "blob",
  });
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Vijetha_Invoice_VJ${String(orderId).padStart(8, "0")}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

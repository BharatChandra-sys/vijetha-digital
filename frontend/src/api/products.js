import api from "./axios";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Wake up the backend before making requests.
 * Render free tier sleeps after 15 min inactivity.
 * A quick /health ping wakes it before the real request.
 */
async function ensureBackendAwake() {
  // Only do this in production against Render
  if (!import.meta.env.PROD) return;
  if (!BACKEND_URL.includes("render.com")) return;

  try {
    await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(3000), // 3s timeout for ping
    });
  } catch {
    // Ignore - backend might be waking up, main request will wait
  }
}

export const getProducts = async (params = {}) => {
  // Wake backend first (non-blocking attempt)
  await ensureBackendAwake();

  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/products?${queryString}` : "/products";

    console.log("Fetching products from:", BACKEND_URL + url);
    const res = await api.get(url);
    console.log("Products response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.status, error.message);
    throw error;
  }
};

export const getProduct = async (slug) => {
  try {
    const res = await api.get(`/products/${slug}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product:", error.response?.status, error.message);
    throw error;
  }
};

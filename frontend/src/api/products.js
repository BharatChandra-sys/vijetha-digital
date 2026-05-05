import api from "./axios";

export const getProducts = async () => {
  try {
    console.log("Fetching products from:", api.defaults.baseURL + "/products");
    const res = await api.get("/products");
    console.log("Products response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    console.error("Error details:", error.response || error.message);
    throw error;
  }
};

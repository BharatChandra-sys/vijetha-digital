import api from "./axios";

export const getReviews = async (productId, page = 1) => {
  const res = await api.get(`/products/${productId}/reviews?page=${page}&per_page=10`);
  return res.data;
};

export const getReviewSummary = async (productId) => {
  const res = await api.get(`/products/${productId}/reviews/summary`);
  return res.data;
};

export const getMyReview = async (productId) => {
  const res = await api.get(`/products/${productId}/reviews/mine`);
  return res.data;
};

export const postReview = async (productId, data) => {
  const res = await api.post(`/products/${productId}/reviews`, data);
  return res.data;
};

export const uploadReviewMedia = async (productId, files) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await api.post(`/products/${productId}/reviews/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.urls;
};

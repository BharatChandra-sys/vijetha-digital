import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search);
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/auth/refresh",
          { refresh_token: refreshToken }
        );

        const newAccessToken = res.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(error.config);
      } catch {
        localStorage.clear();
        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
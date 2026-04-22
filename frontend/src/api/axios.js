import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  withCredentials: false,
  timeout: 15000,
});

function clearAuthStorage() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_info");
}

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
    // Handle maintenance mode
    if (error.response?.status === 503 && error.response?.data?.maintenance) {
      if (!window.location.pathname.startsWith("/admin") && window.location.pathname !== "/maintenance") {
        window.location.href = "/maintenance";
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      const userInfo = localStorage.getItem("user_info");
      
      // Determine which login portal to redirect to
      let loginPath = "/login";
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.role === "admin") {
            loginPath = "/admin/login";
          } else if (user.iam_roles && user.iam_roles.length > 0) {
            loginPath = "/staff/login";
          }
        } catch {
          // Invalid JSON, use default
        }
      }

      if (!refreshToken) {
        clearAuthStorage();
        window.location.href = loginPath + "?redirect=" + encodeURIComponent(window.location.pathname + window.location.search);
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const newAccessToken = res.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(error.config);
      } catch {
        clearAuthStorage();
        window.location.href = loginPath + "?redirect=" + encodeURIComponent(window.location.pathname + window.location.search);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
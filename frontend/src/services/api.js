import axios from "axios";

const api = axios.create({
  baseURL: "https://ease-point.onrender.com/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ponto_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("ponto_token");
      localStorage.removeItem("ponto_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

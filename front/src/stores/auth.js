import { defineStore } from "pinia";
import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ponto_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(key),
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: storage.get("ponto_user"),
    token: localStorage.getItem("ponto_token"),
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      try {
        const { data } = await api.post("/users/login", { email, password });

        const token = data.session?.access_token || data.token;

        this.setSession(token, data.user);
        router.push("/dashboard");
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email) {
      this.loading = true;
      try {
        await api.post("/users/forgot-password", { email });
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(token, password) {
      this.loading = true;
      try {
        await api.post("/users/reset-password", { token, password });
      } finally {
        this.loading = false;
      }
    },

    async registerCompany(payload) {
      this.loading = true;
      try {
        const { data } = await api.post("/companies", payload);
        if (data.user && data.session) {
          const token = data.session.access_token;
          this.setSession(token, data.user);
        }
        return data;
      } finally {
        this.loading = false;
      }
    },

    async loginWithProvider(provider) {
      this.loading = true;
      try {
        const { data } = await api.get(`/users/auth/${provider}`);
        window.location.href = data.url;
      } catch (error) {
        console.error(`Erro Auth ${provider}:`, error);
        this.loading = false;
      }
    },

    async completeGoogleRegistration(payload) {
      this.loading = true;
      try {
        const { data } = await api.post("/companies/google-setup", payload);
        if (data.user) {
          this.user = data.user;
          storage.set("ponto_user", data.user);
        }
        return data;
      } finally {
        this.loading = false;
      }
    },

    setSession(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem("ponto_token", token);
      storage.set("ponto_user", user);
    },

    checkOAuthCallback() {
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");

        if (accessToken) {
          localStorage.setItem("ponto_token", accessToken);
          this.token = accessToken;
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          router.push("/dashboard");
        }
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("ponto_token");
      storage.remove("ponto_user");
      router.push("/login");
    },
  },
});

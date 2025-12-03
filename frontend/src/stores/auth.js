import { defineStore } from "pinia";
import router from "@/router";
import { useSnackbarStore } from "@/stores/snackbar";
import api from "@/services/api";

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
    // --- 1. BUSCAR USUÁRIO ---
    async fetchUser() {
      try {
        const { data } = await api.get("/auth/me");
        this.setSession(this.token, data);
        return data;
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          this.clearSession();
        }
        throw error;
      }
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem("ponto_token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    // --- LOGIN COM EMAIL ---
    async login(email, password) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const { data } = await api.post("/auth/login", { email, password });
        const token = data.session?.access_token || data.token;
        if (!token) throw new Error("Token não recebido");

        this.setSession(token, data.user);
        snackbar.showSnackbar(`Bem-vindo, ${data.user.name}!`, "success");
        router.push("/dashboard");
      } catch (error) {
        const msg = error.response?.data?.error || "Email ou senha inválidos";
        snackbar.showSnackbar(msg, "error");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // --- LOGOUT ---
    async logout() {
      const snackbar = useSnackbarStore();
      try {
        if (this.token) {
          await api.post("/auth/logout");
        }
      } catch (error) {
        console.error("Erro ao fazer logout", error);
      } finally {
        this.clearSession();
        snackbar.showSnackbar("Você saiu do sistema.", "info");
        router.push("/login");
      }
    },

    // --- LOGIN SOCIAL (CORRIGIDO) ---
    async loginWithProvider(provider) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const { data } = await api.get(`/provider/${provider}`);
        window.location.href = data.url;
      } catch (error) {
        console.error(`Erro Auth ${provider}:`, error);
        snackbar.showSnackbar(`Erro ao conectar com ${provider}`, "error");
        this.loading = false;
      }
    },

    // --- COMPLETAR CADASTRO GOOGLE ---
    async completeGoogleSignup(payload) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const { data } = await api.post("/provider/google-complete", payload);

        if (data.user) {
          this.setSession(this.token, data.user);
        }

        snackbar.showSnackbar("Cadastro finalizado com sucesso!", "success");
        router.push("/dashboard");
        return data;
      } catch (error) {
        const msg =
          error.response?.data?.error || "Erro ao finalizar cadastro.";
        snackbar.showSnackbar(msg, "error");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // --- CALLBACK DO OAUTH ---
    async checkOAuthCallback() {
      const hash = window.location.hash;
      const snackbar = useSnackbarStore();

      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (accessToken) {
          this.setToken(accessToken);

          if (refreshToken) {
            localStorage.setItem("ponto_refresh_token", refreshToken);
          }

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          if (type === "recovery") {
            snackbar.showSnackbar("Defina sua nova senha.", "info");
            router.push("/update-password");
          } else {
            try {
              await this.fetchUser();
              snackbar.showSnackbar("Login realizado com sucesso!", "success");
              router.push("/dashboard");
            } catch (error) {
              if (error.response && error.response.status === 404) {
                snackbar.showSnackbar("Finalize seu cadastro.", "info");
                router.push("/complete-signup");
              } else {
                console.error("Erro callback:", error);
                snackbar.showSnackbar("Falha na autenticação.", "error");
                this.logout();
              }
            }
          }
        }
      }
    },

    // --- AUXILIARES ---
    setSession(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem("ponto_token", token);
      storage.set("ponto_user", user);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    clearSession() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("ponto_token");
      localStorage.removeItem("ponto_refresh_token");
      storage.remove("ponto_user");
      delete api.defaults.headers.common["Authorization"];
    },
  },
});

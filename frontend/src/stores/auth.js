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
    // --- LOGIN ---
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
        console.error("Erro ao fazer logout na API", error);
      } finally {
        this.clearSession();
        snackbar.showSnackbar("Você saiu do sistema.", "info");
        router.push("/login");
      }
    },

    // --- ESQUECI A SENHA ---
    async forgotPassword(email) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        await api.post("/users/forgot-password", { email });
        snackbar.showSnackbar(
          "Se o e-mail existir, você receberá um link.",
          "success"
        );
      } catch (error) {
        snackbar.showSnackbar("Erro ao solicitar recuperação.", "error");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // --- REDEFINIR SENHA ---
    async resetPassword(password) {
      const snackbar = useSnackbarStore();
      this.loading = true;

      try {
        if (!this.token) {
          throw new Error(
            "Sessão inválida. Clique no link do e-mail novamente."
          );
        }
        await api.post("/users/reset-password", { password });
        snackbar.showSnackbar("Senha alterada com sucesso!", "success");
        router.push("/dashboard");
      } catch (error) {
        const msg = error.response?.data?.error || "Erro ao redefinir senha";
        snackbar.showSnackbar(msg, "error");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // --- CADASTRO DE EMPRESA ---
    async registerCompany(payload) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const { data } = await api.post("/companies", payload);

        if (data.user && data.session) {
          const token = data.session.access_token;
          this.setSession(token, data.user);
        }

        snackbar.showSnackbar("Empresa cadastrada com sucesso!", "success");
        return data;
      } catch (error) {
        const msg = error.response?.data?.error || "Erro ao cadastrar empresa";
        snackbar.showSnackbar(msg, "error");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // --- LOGIN SOCIAL ---
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
    async completeGoogleRegistration(payload) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const { data } = await api.post("/companies/google-setup", payload);
        if (data.user) {
          this.user = data.user;
          storage.set("ponto_user", data.user);
        }
        snackbar.showSnackbar("Cadastro concluído!", "success");
        return data;
      } catch (error) {
        snackbar.showSnackbar("Erro ao finalizar cadastro.", "error");
        throw error;
      } finally {
        this.loading = false;
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
      storage.remove("ponto_user");
      delete api.defaults.headers.common["Authorization"];
    },

    async checkOAuthCallback() {
      const hash = window.location.hash;

      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const type = params.get("type");

        if (accessToken) {
          this.token = accessToken;
          localStorage.setItem("ponto_token", accessToken);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          const snackbar = useSnackbarStore();

          if (type === "recovery") {
            snackbar.showSnackbar("Defina sua nova senha.", "info");
            router.push("/update-password");
          } else {
            try {
              snackbar.showSnackbar("Login realizado com sucesso!", "success");
              router.push("/dashboard");
            } catch (e) {
              console.error("Erro ao carregar usuário via token");
            }
          }
        }
      }
    },
  },
});

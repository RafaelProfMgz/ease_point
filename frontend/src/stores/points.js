import { defineStore } from "pinia";
import { useSnackbarStore } from "@/stores/snackbar";
import api from "@/services/api";

const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(key),
};

export const usePointsStore = defineStore("points", {
  state: () => ({
    points: storage.get("ponto_points"),
    loading: false,
  }),

  actions: {
    // GET /points
    async getPoints() {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const { data } = await api.get("/points");
        this.points = data;
        storage.set("ponto_points", this.points);
      } catch (error) {
        this.points = [];
        snackbar.showSnackbar("Erro ao buscar pontos.", "error");
      } finally {
        this.loading = false;
      }
    },

    // GET /points/user/:id
    async getPointsUser() {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const { data } = await api.get("/points");

        this.points = data;
        storage.set("ponto_points", this.points);
      } catch (error) {
        console.error(error);
        snackbar.showSnackbar("Erro ao atualizar lista.", "error");
      } finally {
        this.loading = false;
      }
    },

    // GET /points/company/:id
    async getCompanyPoints(companyId) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const { data } = await api.get(`/points/company/${companyId}`);
        this.points = data;

        storage.set("ponto_points_company", data);
      } catch (error) {
        snackbar.showSnackbar("Erro ao buscar pontos da empresa.", "error");
      } finally {
        this.loading = false;
      }
    },

    // GET /points/:id
    async getPoint(id) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const localPoint = this.points.find((p) => p.id === id);
        if (localPoint) {
          this.loading = false;
          return localPoint;
        }

        const { data } = await api.get(`/points/${id}`);
        return data;
      } catch (error) {
        snackbar.showSnackbar("Erro ao buscar ponto.", "error");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // POST /points
    async registerPoint(payload) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const { data } = await api.post("/points", payload);

        this.points.push(data);

        storage.set("ponto_points", this.points);
        snackbar.showSnackbar("Ponto registrado com sucesso!", "success");
        return data;
      } catch (error) {
        const msg = error.response?.data?.error || "Erro ao registrar ponto";
        snackbar.showSnackbar(msg, "error");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // PUT /points/:id
    async updatePoint(id, payload) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        const { data } = await api.put(`/points/${id}`, payload);

        const index = this.points.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.points[index] = data;
          storage.set("ponto_points", this.points);
        }

        snackbar.showSnackbar("Ponto atualizado!", "success");
        return data;
      } catch (error) {
        const msg = error.response?.data?.error || "Erro ao atualizar ponto";
        snackbar.showSnackbar(msg, "error");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // DELETE /points/:id
    async deletePoint(id) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      try {
        await api.delete(`/points/${id}`);

        this.points = this.points.filter((p) => p.id !== id);
        storage.set("ponto_points", this.points);

        snackbar.showSnackbar("Registro excluído!", "success");
      } catch (error) {
        const msg = error.response?.data?.error || "Erro ao excluir ponto";
        snackbar.showSnackbar(msg, "error");
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});

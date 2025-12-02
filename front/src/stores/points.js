import { defineStore } from "pinia";
import api from "@/services/api";
import { useSnackbarStore } from "@/stores/snackbar";

export const usePointStore = defineStore("points", {
  state: () => ({
    points: [],
    loading: false,
  }),

  getters: {
    history: (state) => {
      return [...state.points].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    },

    lastPoint: (state) => {
      const sorted = [...state.points].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      return sorted[0] || null;
    },

    todaySummary: (state) => {
      const today = new Date().toLocaleDateString();
      const todayPoints = state.points.filter(
        (p) => new Date(p.created_at).toLocaleDateString() === today
      );

      return {
        count: todayPoints.length,
        items: todayPoints,
      };
    },
  },

  actions: {
    async fetchMyPoints() {
      this.loading = true;
      try {
        const { data } = await api.get("/points");
        this.points = data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCompanyPoints(companyId) {
      this.loading = true;
      try {
        const { data } = await api.get(`/points/company/${companyId}`);
        this.points = data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async registerPoint(type, description = "Registro via Web") {
      const snackbar = useSnackbarStore();
      this.loading = true;
      
      try {
        await api.post("/points", { type, description });
        await this.fetchMyPoints();
        
        snackbar.showSnackbar(`Ponto de ${type} registrado com sucesso!`, 'success');
      } catch (error) {
        const msg = error.response?.data?.error || 'Falha ao registrar ponto';
        snackbar.showSnackbar(msg, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePoint(id, payload) {
      const snackbar = useSnackbarStore();
      this.loading = true;
      
      try {
        await api.put(`/points/${id}`, payload);
        await this.fetchMyPoints();
        
        snackbar.showSnackbar('Registro atualizado com sucesso!', 'success');
      } catch (error) {
        const msg = error.response?.data?.error || 'Erro ao atualizar registro';
        snackbar.showSnackbar(msg, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePoint(id) {
      const snackbar = useSnackbarStore(); 
      this.loading = true;
      
      try {
        await api.delete(`/points/${id}`);
        this.points = this.points.filter((p) => p.id !== id);
        
        snackbar.showSnackbar('Registro removido com sucesso!', 'success');
      } catch (error) {
        const msg = error.response?.data?.error || 'Erro ao excluir registro';
        snackbar.showSnackbar(msg, 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
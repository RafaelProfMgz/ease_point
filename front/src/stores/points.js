import { defineStore } from 'pinia'
import axios from 'axios'
import { useSnackbarStore } from '@/stores/snackbar' 

export const usePointStore = defineStore('points', {
  state: () => ({
    history: [],
    loading: false,
    summary: {
      todayCount: 0,
      lastRegister: null
    }
  }),

  actions: {
    async fetchHistory() {
      this.loading = true
       const notify = useSnackbarStore() 

      try {
        const { data } = await axios.get('/points')
        this.history = data
        this.calculateSummary()
      } catch (error) {
        console.error('Erro ao buscar histórico', error)
        notify.showSnackbar('Não foi possível carregar o histórico.', 'warning')
      } finally {
        this.loading = false
      }
    },

    async registerPoint(type) {
      this.loading = true
      const notify = useSnackbarStore()

      try {
        await axios.post('/points', {
          type: type,
          description: 'Registro via Dashboard Web'
        })
        
        await this.fetchHistory()
        
        notify.showSnackbar(`Ponto de ${type} registrado com sucesso!`, 'success')
        
        return true
      } catch (error) {
        const msg = error.response?.data?.error || 'Erro ao registrar ponto. Tente novamente.'
        notify.showSnackbar(msg, 'error')
        
        throw error
      } finally {
        this.loading = false
      }
    },

    calculateSummary() {
      const today = new Date().toLocaleDateString()
      
      this.summary.todayCount = this.history.filter(p => 
        new Date(p.created_at).toLocaleDateString() === today
      ).length

      if (this.history.length > 0) {
        this.summary.lastRegister = this.history[0]
      }
    }
  }
})
import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Tenta pegar do LocalStorage, mas se der erro no JSON, inicia nulo
    user: safeGetStorage(),
    session: null,
    loading: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user
  },

actions: {
  async loginWithProvider(providerName) {
    this.loading = true

    const redirectUrl = window.location.origin 

    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerName,
      options: { 
        redirectTo: redirectUrl,
        skipBrowserRedirect: false 
      }
    })

    if (error) {
      this.loading = false
      throw error
    }
  },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.session = null
      localStorage.removeItem('ponto_user')
      router.push('/')
    },

    async checkSession() {
      this.loading = true
      try {
        // Pega a sessão atual
        const { data, error } = await supabase.auth.getSession()
        
        // Se tiver erro (aquele GET vermelho), ignoramos e deslogamos
        if (error || !data.session) {
          throw new Error('Sem sessão')
        }

        // Se deu certo, atualiza
        this.session = data.session
        this.user = data.session.user
        localStorage.setItem('ponto_user', JSON.stringify(this.user))
        
      } catch (e) {
        // Se der erro, garante que limpa tudo para não travar
        this.user = null
        this.session = null
        localStorage.removeItem('ponto_user')
      } finally {
        this.loading = false
      }
    }
  }
})

// Função auxiliar para evitar erro se o localStorage estiver corrompido
function safeGetStorage() {
  try {
    return JSON.parse(localStorage.getItem('ponto_user'))
  } catch {
    return null
  }
}
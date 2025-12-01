import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

axios.defaults.baseURL = 'http://localhost:3001';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: safeGetStorage('ponto_user'),
    token: localStorage.getItem('ponto_token') || null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(email, password) {
      this.loading = true
      try {
        const { data } = await axios.post('/users/login', { email, password })
        
        this.setSession(data.session.access_token, data.user)
        router.push('/dashboard')
      } catch (error) {
        console.error('Erro login:', error.response?.data || error)
        throw error 
      } finally {
        this.loading = false
      }
    },

    async registerCompany(payload) {
        this.loading = true
        try {
            const { data } = await axios.post('/companies', payload);
            
            if (data.user && data.session) {
                this.setSession(data.session.access_token, data.user);
            }
            return data;
        } catch (error) {
            throw error;
        } finally {
            this.loading = false
        }
    },

    async completeGoogleRegistration(payload) {
        this.loading = true
        try {
            const { data } = await axios.post('/companies/google-setup', payload);
            
            this.user = data.user;
            localStorage.setItem('ponto_user', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            throw error;
        } finally {
            this.loading = false
        }
    },

    async loginWithProvider() {
      this.loading = true
      try {
        const { data } = await axios.get('/users/auth/google')
        window.location.href = data.url
      } catch (error) {
        console.error('Erro Google Auth:', error)
        this.loading = false
      }
    },

    async createEmployee(payload) {
        this.loading = true
        try {
            await axios.post('/users/register', payload);
        } catch (error) {
            throw error;
        } finally {
            this.loading = false;
        }
    },

    processOAuthCallback() {
      const hash = window.location.hash
      if (!hash) return

      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      
      if (accessToken) {
        this.token = accessToken
        localStorage.setItem('ponto_token', accessToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        
        window.history.replaceState({}, document.title, window.location.pathname)
        

        router.push('/dashboard') 
      }
    },

    async logout() {
      this.clearSession()
      router.push('/')
    },

    checkSession() {
      const token = localStorage.getItem('ponto_token')
      const user = safeGetStorage('ponto_user')

      if (window.location.hash && window.location.hash.includes('access_token')) {
        this.processOAuthCallback()
        return
      }

      if (token) {
        this.token = token
        this.user = user
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        this.clearSession()
      }
    },

    setSession(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('ponto_token', token)
      localStorage.setItem('ponto_user', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    clearSession() {
      this.token = null
      this.user = null
      localStorage.removeItem('ponto_token')
      localStorage.removeItem('ponto_user')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})

function safeGetStorage(key) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}
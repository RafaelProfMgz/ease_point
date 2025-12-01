import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(email, password) {
      try {
        // Ajuste a porta se seu backend não for 3001
        const response = await axios.post('http://localhost:3001/users/login', {
          email,
          password
        });
        
        // Salva token e user
        this.token = response.data.session.access_token;
        this.user = response.data.user;
        
        // Persiste no LocalStorage para não perder ao atualizar página
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        // Configura o header padrão do axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        router.push('/dashboard');
      } catch (error) {
        console.error('Erro no login', error);
        throw error; // Lança para o componente tratar
      }
    },

    async registerCompany(payload) {
        await axios.post('http://localhost:3001/companies', payload);
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      router.push('/');
    }
  }
});
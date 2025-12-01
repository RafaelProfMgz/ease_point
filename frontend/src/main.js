import { registerPlugins } from '@/plugins'
import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

const app = createApp(App)

registerPlugins(app)

// Configuração Base do Axios
axios.defaults.baseURL = 'http://localhost:3001';

// Se já tiver token salvo, injeta no header ao iniciar o app
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

app.use(router);
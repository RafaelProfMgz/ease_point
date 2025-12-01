import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import Dashboard from '@/pages/Dashboard.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Login },
    { path: '/register', component: Register },
    { 
      path: '/dashboard', 
      component: Dashboard,
      meta: { requiresAuth: true }
    },
  ]
});

// Guardião de Rotas (Proteção)
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  
  if (to.meta.requiresAuth && !auth.token) {
    next('/'); // Manda pro login se não tiver token
  } else {
    next();
  }
});

export default router;
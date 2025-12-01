import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

router.beforeEach(async (to, from, next) => {
  const localUser = localStorage.getItem('ponto_user')
  const publicPages = ['/', '/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  if (to.hash && to.hash.includes('access_token')) {
    return next()
  }

  if (authRequired && !localUser) {
    return next('/login')
  } 
  
  else if (publicPages.includes(to.path) && localUser) {
    return next('/dashboard')
  } 
  
  else {
    next()
  }
})


router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
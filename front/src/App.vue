<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabase' // ajuste o caminho se necessário
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    
    if (event === 'SIGNED_IN' && session) {
      console.log("Login detectado via evento Supabase!")
      
      authStore.user = session.user
      authStore.session = session
      localStorage.setItem('ponto_user', JSON.stringify(session.user))
      
      // Se estiver na raiz (Login), manda pro dashboard
      // O replace é melhor que push aqui para não deixar voltar pro login com o botão "voltar"
      if (router.currentRoute.value.path === '/') {
        await router.replace('/dashboard')
      }
    } 
    else if (event === 'SIGNED_OUT') {
      authStore.user = null
      authStore.session = null
      localStorage.removeItem('ponto_user')
      router.replace('/')
    }
  })


  await authStore.checkSession()
  
  // Verificação extra de segurança: Se tem hash na URL mas o usuário ainda está nulo
  // (caso raro onde o listener falha), forçamos uma verificação.
  if (window.location.hash && window.location.hash.includes('access_token')) {
    console.log("Hash encontrado, forçando verificação de sessão...")
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      authStore.user = data.session.user
      router.replace('/dashboard')
    }
  }
})
</script>
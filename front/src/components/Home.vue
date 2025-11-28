<template>
  <v-container class="fill-height bg-grey-darken-4" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        
        <v-card class="elevation-16 rounded-xl pa-6 bg-grey-darken-3">
          
          <div class="text-center mb-6">
            <v-icon icon="mdi-clock-time-four-outline" size="60" color="primary" class="mb-2"></v-icon>
            <h1 class="text-h4 font-weight-black text-white mb-2">PontoFácil</h1>
            <p class="text-subtitle-1 text-grey-lighten-1">Gestão inteligente de horários</p>
          </div>

          <div v-if="!authStore.user">
            
            <p class="text-center text-grey mb-4">Escolha como deseja entrar:</p>

            <v-btn
              color="white"
              block
              size="x-large"
              variant="flat"
              prepend-icon="mdi-google"
              class="text-red-darken-2 font-weight-bold mb-3"
              :loading="authStore.loading"
              @click="handleLogin('google')"
            >
              Entrar com Google
            </v-btn>

            <v-btn
              color="black"
              block
              size="x-large"
              variant="flat"
              prepend-icon="mdi-github"
              class="font-weight-bold"
              :loading="authStore.loading"
              @click="handleLogin('github')"
            >
              Entrar com GitHub
            </v-btn>

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mt-4"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>
          </div>

          <div v-else class="text-center">
            <v-divider class="mb-4"></v-divider>
            
            <v-avatar size="100" class="mb-3 elevation-5" border>
              <v-img :src="authStore.user?.user_metadata?.avatar_url" cover></v-img>
            </v-avatar>
            
            <h3 class="text-h5 font-weight-bold mb-1">
              {{ authStore.user?.user_metadata?.full_name || 'Usuário' }}
            </h3>
            <p class="text-caption text-grey mb-6">{{ authStore.user?.email }}</p>
            
            <div class="d-flex flex-column gap-2">
              <v-btn 
                color="primary" 
                size="large" 
                block 
                prepend-icon="mdi-view-dashboard"
                to="/dashboard"
              >
                Acessar Painel
              </v-btn>
              
              <v-btn 
                color="red-darken-3" 
                variant="text" 
                block 
                class="mt-2"
                @click="authStore.logout()"
              >
                Sair da Conta
              </v-btn>
            </div>
          </div>

        </v-card>

        <p class="text-center text-grey-darken-1 mt-6 text-caption">
          Desenvolvido para a disciplina de Frameworks Modernos &copy; 2025
        </p>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()
const errorMessage = ref('')

const handleLogin = async (provider) => {
  errorMessage.value = '' 
  try {
    await authStore.loginWithProvider(provider)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Falha no login: ' + (error.message || 'Erro desconhecido')
    authStore.loading = false 
  }
}
</script>
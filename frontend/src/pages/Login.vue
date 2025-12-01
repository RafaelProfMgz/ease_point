<template>
  <v-container class="fill-height justify-center">
    <v-card width="400" elevation="4" class="pa-5">
      <v-card-title class="text-center text-h5 font-weight-bold text-primary">
        Sistema de Ponto
      </v-card-title>
      
      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="Email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Senha"
            type="password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
          ></v-text-field>

          <v-btn 
            block 
            color="primary" 
            size="large" 
            type="submit" 
            :loading="loading"
          >
            Entrar
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center flex-column">
        <span class="text-caption">Não tem conta?</span>
        <v-btn variant="text" color="secondary" to="/register">
          Cadastrar Minha Empresa
        </v-btn>
      </v-card-actions>
      
      <v-alert v-if="errorMsg" type="error" class="mt-3" density="compact">
        {{ errorMsg }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    await auth.login(email.value, password.value);
  } catch (e) {
    errorMsg.value = e.response?.data?.error || 'Erro ao fazer login';
  } finally {
    loading.value = false;
  }
};
</script>
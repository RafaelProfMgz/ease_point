<template>
  <v-container class="fill-height bg-grey-lighten-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6" elevation="8" rounded="lg">
          <div class="text-center mb-6">
            <v-icon icon="mdi-clock-fast" size="50" color="primary"></v-icon>
            <h2 class="text-h5 font-weight-bold mt-2">Bem-vindo de volta</h2>
            <div class="text-subtitle-2 text-grey">Faça login para continuar</div>
          </div>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email corporativo"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="primary"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Senha"
              type="password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              color="primary"
              class="mb-4"
            ></v-text-field>

            <v-btn
              block
              color="primary"
              size="large"
              type="submit"
              :loading="auth.loading"
            >
              Entrar
            </v-btn>
          </v-form>

          <div class="text-center my-4 text-grey-darken-1">ou entre com</div>

          <v-btn
            block
            color="grey-darken-3"
            prepend-icon="mdi-google"
            @click="auth.loginWithProvider()"
            :loading="auth.loading"
          >
            Google
          </v-btn>

          <v-divider class="my-6"></v-divider>

          <div class="text-center">
            <span class="text-body-2 text-grey">Ainda não tem conta?</span>
            <v-btn variant="text" color="primary" to="/register" class="font-weight-bold">
              Cadastre sua empresa
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    
    <v-snackbar v-model="error" color="error">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value);
  } catch (e) {
    errorMessage.value = e.response?.data?.error || 'Erro ao realizar login';
    error.value = true;
  }
};
</script>
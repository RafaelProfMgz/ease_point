<template>
  <v-container class="fill-height justify-center">
    <v-card width="500" elevation="4" class="pa-5">
      <v-card-title class="text-h5 text-center">Nova Empresa</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleRegister">
          
          <p class="text-subtitle-2 font-weight-bold mb-2">Dados da Empresa</p>
          <v-text-field v-model="form.companyName" label="Nome da Empresa" variant="outlined" density="compact"></v-text-field>
          
          <v-select 
            v-model="form.plan" 
            :items="['bronze', 'prata', 'ouro']" 
            label="Plano" 
            variant="outlined"
            density="compact"
          ></v-select>

          <v-divider class="my-4"></v-divider>
          <p class="text-subtitle-2 font-weight-bold mb-2">Dados do Admin</p>

          <v-text-field v-model="form.adminName" label="Seu Nome" variant="outlined" density="compact"></v-text-field>
          <v-text-field v-model="form.email" label="Email de Login" variant="outlined" density="compact"></v-text-field>
          <v-text-field v-model="form.password" label="Senha" type="password" variant="outlined" density="compact"></v-text-field>

          <v-btn block color="success" size="large" type="submit" :loading="loading" class="mt-4">
            Criar Conta
          </v-btn>
          <v-btn block variant="text" to="/" class="mt-2">Voltar ao Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="showSuccess" color="success">
      Empresa criada! Faça login.
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const form = reactive({
  companyName: '',
  plan: 'bronze',
  adminName: '',
  email: '',
  password: ''
});

const loading = ref(false);
const showSuccess = ref(false);

const handleRegister = async () => {
  loading.value = true;
  try {
    await auth.registerCompany(form);
    showSuccess.value = true;
    setTimeout(() => router.push('/'), 2000);
  } catch (e) {
    alert(e.response?.data?.error || 'Erro ao criar conta');
  } finally {
    loading.value = false;
  }
};
</script>
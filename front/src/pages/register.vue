<template>
  <v-container class="fill-height bg-grey-lighten-4" fluid>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="5">
        <v-card class="pa-6" elevation="8" rounded="lg">
          <div class="text-center mb-6">
            <h2 class="text-h5 font-weight-bold">Comece Grátis</h2>
            <div class="text-subtitle-2 text-grey">Crie sua empresa e gerencie seus pontos</div>
          </div>

          <v-form @submit.prevent="handleRegister">
            <v-row>
              <v-col cols="12">
                <p class="text-caption font-weight-bold mb-1 text-uppercase text-grey-darken-2">Dados da Empresa</p>
                <v-text-field
                  v-model="form.companyName"
                  label="Nome da Empresa"
                  variant="outlined"
                  density="compact"
                  color="primary"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="form.plan"
                  :items="['bronze', 'prata', 'ouro']"
                  label="Escolha um Plano"
                  variant="outlined"
                  density="compact"
                  color="primary"
                ></v-select>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <v-row>
              <v-col cols="12">
                <p class="text-caption font-weight-bold mb-1 text-uppercase text-grey-darken-2">Dados do Administrador</p>
                <v-text-field
                  v-model="form.adminName"
                  label="Seu Nome Completo"
                  variant="outlined"
                  density="compact"
                  color="primary"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  label="Seu Email de Login"
                  type="email"
                  variant="outlined"
                  density="compact"
                  color="primary"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.password"
                  label="Crie uma Senha"
                  type="password"
                  variant="outlined"
                  density="compact"
                  color="primary"
                  hint="Mínimo 6 caracteres"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              block
              color="primary"
              size="large"
              type="submit"
              class="mt-6"
              :loading="loading"
            >
              Criar Conta e Acessar
            </v-btn>
          </v-form>

          <div class="text-center mt-4">
            <v-btn variant="text" size="small" to="/login" color="grey-darken-2">
              Já tenho uma conta
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);

const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const form = reactive({
  companyName: '',
  plan: 'bronze',
  adminName: '',
  email: '',
  password: ''
});

const handleRegister = async () => {
  if(!form.companyName || !form.email || !form.password) {
    showSnackbar('Preencha todos os campos obrigatórios', 'warning');
    return;
  }

  loading.value = true;
  try {
    await auth.registerCompany(form);
    showSnackbar('Conta criada com sucesso! Redirecionando...', 'success');
    setTimeout(() => {
        router.push('/dashboard');
    }, 1500);
  } catch (e) {
    const msg = e.response?.data?.error || 'Erro ao criar conta. Tente novamente.';
    showSnackbar(msg, 'error');
  } finally {
    loading.value = false;
  }
};

const showSnackbar = (text, color) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};
</script>
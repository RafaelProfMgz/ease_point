<template>
  <v-container fluid class="fill-height login-bg">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="pa-8" elevation="12" rounded="xl">
          <div class="text-center mb-6">
            <v-avatar color="primary" size="64" class="mb-4">
              <v-icon icon="mdi-account-clock" size="32" color="white"></v-icon>
            </v-avatar>
            <h2 class="text-h5 font-weight-bold text-primary">
              Acesso ao Sistema
            </h2>
            <p class="text-body-2 text-medium-emphasis">
              Gerencie seu ponto eletrônico
            </p>
          </div>

          <v-form @submit.prevent="handleLogin" v-model="isValid">
            <v-text-field
              v-model="email"
              label="E-mail"
              placeholder="seu@email.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="primary"
              :rules="[rules.required, rules.email]"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Senha"
              :type="showPass ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPass = !showPass"
              variant="outlined"
              color="primary"
              :rules="[rules.required]"
              class="mb-4"
            ></v-text-field>

            <v-btn
              block
              color="primary"
              size="large"
              type="submit"
              :loading="auth.loading"
              :disabled="!isValid"
              class="text-none font-weight-bold"
              rounded="lg"
            >
              Entrar
            </v-btn>
          </v-form>

          <div class="d-flex align-center my-6">
            <v-divider></v-divider>
            <span class="mx-3 text-caption text-grey">OU</span>
            <v-divider></v-divider>
          </div>

          <v-row dense>
            <v-col cols="6">
              <v-btn
                block
                variant="outlined"
                prepend-icon="mdi-google"
                @click="auth.loginWithProvider('google')"
                :loading="auth.loading"
              >
                Google
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                variant="outlined"
                prepend-icon="mdi-github"
                @click="auth.loginWithProvider('github')"
                :loading="auth.loading"
              >
                GitHub
              </v-btn>
            </v-col>
          </v-row>

          <div class="text-center mt-6">
            <v-btn
              variant="text"
              color="primary"
              to="/register"
              class="text-none"
            >
              Cadastrar minha empresa
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="hasError" color="error" location="top" timeout="3000">
      <v-icon start icon="mdi-alert-circle"></v-icon>
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const email = ref("");
const password = ref("");
const showPass = ref(false);
const isValid = ref(false);

const hasError = ref(false);
const errorMessage = ref("");

const rules = {
  required: (v) => !!v || "Campo obrigatório",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
};

onMounted(() => {
  auth.checkOAuthCallback();
});

const handleLogin = async () => {
  if (!isValid.value) return;

  try {
    await auth.login(email.value, password.value);
  } catch (err) {
    console.log(err);
    errorMessage.value =
      err.response?.data?.error || "Erro ao conectar com o servidor.";
    hasError.value = true;
  }
};
</script>

<style scoped>
.login-bg {
  background: linear-gradient(135deg, #ece9e6 0%, #ffffff 100%);
}
</style>

<template>
  <v-container fluid class="fill-height landing-bg">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <v-row justify="center" align="center" class="z-index-1 w-100">
      <v-col cols="12" sm="8" md="5" lg="4">
        
        <v-card class="pa-8 glass-card" elevation="0" rounded="xl">
          <div class="text-center mb-8">
            <v-avatar color="rgba(255,255,255,0.1)" size="80" class="mb-4 border-highlight">
              <v-icon icon="mdi-account-clock" size="40" class="text-gradient-icon"></v-icon>
            </v-avatar>
            
            <h2 class="text-h4 font-weight-bold text-white mb-2">
              Bem-vindo
            </h2>
            <p class="text-body-1 text-grey-lighten-1">
              Faça login para gerenciar seu ponto
            </p>
          </div>

          <v-form ref="formRef" @submit.prevent="handleLogin" v-model="isValid">
            <v-text-field
              v-model="email"
              label="E-mail"
              placeholder="seu@email.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              bg-color="rgba(0,0,0,0.2)"
              color="primary-lighten-1"
              base-color="grey-lighten-2"
              rounded="lg"
              :rules="[rules.required, rules.email]"
              class="mb-3 text-white"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Senha"
              :type="showPass ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPass = !showPass"
              variant="outlined"
              bg-color="rgba(0,0,0,0.2)"
              color="primary-lighten-1"
              base-color="grey-lighten-2"
              rounded="lg"
              :rules="[rules.required]"
              class="mb-2 text-white"
            ></v-text-field>

            <div class="d-flex justify-end mb-6">
              <router-link 
                to="/forgotPassword" 
                class="text-caption text-grey-lighten-1 text-decoration-none hover-highlight"
              >
                Esqueceu a senha?
              </router-link>
            </div>

            <v-btn
              block
              size="x-large"
              type="submit"
              :loading="auth.loading"
              class="text-none font-weight-bold btn-gradient text-white"
              rounded="xl"
              elevation="10"
            >
              Acessar Sistema
            </v-btn>
          </v-form>

          <div class="d-flex align-center my-6">
            <v-divider color="white" class="opacity-20"></v-divider>
            <span class="mx-3 text-caption text-grey-lighten-2 text-uppercase">ou entrar com</span>
            <v-divider color="white" class="opacity-20"></v-divider>
          </div>

          <v-row dense class="mb-6">
            <v-col cols="6">
              <v-btn
                block
                variant="outlined"
                color="white"
                prepend-icon="mdi-google"
                @click="auth.loginWithProvider('google')"
                :loading="auth.loading"
                class="text-none glass-btn"
                rounded="lg"
              >
                Google
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                variant="outlined"
                color="white"
                prepend-icon="mdi-github"
                @click="auth.loginWithProvider('github')"
                :loading="auth.loading"
                class="text-none glass-btn"
                rounded="lg"
              >
                GitHub
              </v-btn>
            </v-col>
          </v-row>

          <div class="text-center">
            <p class="text-body-2 text-grey-lighten-1">
              Ainda não tem conta? 
              <router-link to="/register" class="text-gradient-link font-weight-bold text-decoration-none ml-1">
                Criar conta
              </router-link>
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="hasError" color="error" location="top" timeout="3000" rounded="lg">
      <div class="d-flex align-center">
        <v-icon icon="mdi-alert-circle" start class="mr-2"></v-icon>
        <span class="font-weight-medium">{{ errorMessage }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const formRef = ref(null); 
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

console.log("Validando formulário de login...");


  try {
    await auth.login(email.value, password.value);
  } catch (err) {
    console.error("Erro no login:", err);
    errorMessage.value =
      err.response?.data?.error || "Erro ao conectar com o servidor.";
    hasError.value = true;
  }
};
</script>

<style scoped>
.landing-bg {
  background-color: #0f172a;
  background-image: radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
                    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
                    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
  position: relative;
  overflow: hidden;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.btn-gradient {
  background: linear-gradient(to right, #6366f1, #a855f7, #ec4899);
  transition: opacity 0.3s ease;
}
.btn-gradient:hover { opacity: 0.9; }

.text-gradient-link, .text-gradient-icon {
  background: linear-gradient(to right, #6366f1, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.text-gradient-icon { color: #a855f7 !important; }

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
}
.blob-1 { width: 400px; height: 400px; background: #4f46e5; top: -100px; left: -100px; }
.blob-2 { width: 300px; height: 300px; background: #ec4899; bottom: -50px; right: -50px; }

.z-index-1 { position: relative; z-index: 1; }
.opacity-20 { opacity: 0.2; }
.glass-btn:hover { background: rgba(255,255,255,0.1) !important; }
.border-highlight { border: 1px solid rgba(168, 85, 247, 0.3); }

.hover-highlight:hover {
  color: #a855f7 !important;
  text-decoration: underline !important;
  transition: color 0.3s ease;
}
</style>
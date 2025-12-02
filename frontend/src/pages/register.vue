<route lang="yaml">
meta:
  layout: blank
</route>

<template>
  <v-container class="fill-height landing-bg" fluid>
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>

    <v-row justify="center" align="center" class="z-index-1 w-100 my-4">
      <v-col cols="12" md="8" lg="6" xl="5">
        <v-card class="pa-8 glass-card" elevation="0" rounded="xl">
          <div class="text-center mb-8">
            <v-avatar
              color="rgba(255,255,255,0.1)"
              size="64"
              class="mb-4 border-highlight"
            >
              <v-icon
                icon="mdi-rocket-launch"
                size="32"
                class="text-gradient-icon"
              ></v-icon>
            </v-avatar>
            <h2 class="text-h4 font-weight-bold text-white mb-2">
              Comece Grátis
            </h2>
            <div class="text-subtitle-1 text-grey-lighten-1">
              Configure sua empresa em menos de 1 minuto
            </div>
          </div>

          <v-form @submit.prevent="handleRegister">
            <div class="d-flex align-center mb-4">
              <v-icon
                icon="mdi-domain"
                color="primary-lighten-1"
                size="small"
                class="mr-2"
              ></v-icon>
              <span
                class="text-caption font-weight-bold text-uppercase text-white letter-spacing-1"
              >
                Dados da Empresa
              </span>
            </div>

            <v-row dense>
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="form.companyName"
                  label="Nome da Empresa"
                  placeholder="Ex: Tech Solutions Ltda"
                  variant="outlined"
                  bg-color="rgba(0,0,0,0.2)"
                  color="primary-lighten-1"
                  base-color="grey-lighten-2"
                  rounded="lg"
                  density="comfortable"
                  class="text-white mb-2"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="4">
                <v-select
                  v-model="form.plan"
                  :items="['Bronze', 'Prata', 'Ouro']"
                  label="Plano"
                  variant="outlined"
                  bg-color="rgba(0,0,0,0.2)"
                  color="primary-lighten-1"
                  base-color="grey-lighten-2"
                  rounded="lg"
                  density="comfortable"
                  class="text-white"
                  menu-icon="mdi-chevron-down"
                ></v-select>
              </v-col>
            </v-row>

            <v-divider class="my-6 border-opacity-20" color="white"></v-divider>

            <div class="d-flex align-center mb-4">
              <v-icon
                icon="mdi-account-circle-outline"
                color="primary-lighten-1"
                size="small"
                class="mr-2"
              ></v-icon>
              <span
                class="text-caption font-weight-bold text-uppercase text-white letter-spacing-1"
              >
                Dados do Administrador
              </span>
            </div>

            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="form.adminName"
                  label="Nome Completo"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  bg-color="rgba(0,0,0,0.2)"
                  color="primary-lighten-1"
                  base-color="grey-lighten-2"
                  rounded="lg"
                  density="comfortable"
                  class="text-white mb-2"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  label="Email de Login"
                  type="email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  bg-color="rgba(0,0,0,0.2)"
                  color="primary-lighten-1"
                  base-color="grey-lighten-2"
                  rounded="lg"
                  density="comfortable"
                  class="text-white mb-2"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.password"
                  label="Crie uma Senha"
                  :type="showPass ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPass = !showPass"
                  variant="outlined"
                  bg-color="rgba(0,0,0,0.2)"
                  color="primary-lighten-1"
                  base-color="grey-lighten-2"
                  rounded="lg"
                  density="comfortable"
                  hint="Mínimo 6 caracteres"
                  persistent-hint
                  class="text-white"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              block
              size="x-large"
              type="submit"
              class="mt-8 btn-gradient text-white text-none font-weight-bold"
              rounded="xl"
              elevation="10"
              :loading="loading"
            >
              Criar Conta e Acessar
            </v-btn>
          </v-form>

          <div class="text-center mt-6">
            <p class="text-body-2 text-grey-lighten-1">
              Já tem uma conta?
              <router-link
                to="/login"
                class="text-gradient-link font-weight-bold text-decoration-none ml-1"
              >
                Fazer Login
              </router-link>
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      location="top"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon
          :icon="
            snackbarColor === 'success'
              ? 'mdi-check-circle'
              : 'mdi-alert-circle'
          "
          start
          class="mr-2"
        ></v-icon>
        <span class="font-weight-medium">{{ snackbarText }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);
const showPass = ref(false);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const form = reactive({
  companyName: "",
  plan: "Bronze",
  adminName: "",
  email: "",
  password: "",
});

const handleRegister = async () => {
  if (!form.companyName || !form.email || !form.password) {
    showSnackbar("Preencha todos os campos obrigatórios", "warning");
    return;
  }

  loading.value = true;

  const payload = {
    ...form,
    plan: form.plan.toLowerCase(),
  };

  try {
    await auth.registerCompany(payload);
    showSnackbar("Conta criada com sucesso! Redirecionando...", "success");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  } catch (e) {
    const msg =
      e.response?.data?.error || "Erro ao criar conta. Tente novamente.";
    showSnackbar(msg, "error");
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

<style scoped>
.landing-bg {
  background-color: #0f172a;
  background-image: radial-gradient(
      at 0% 0%,
      hsla(253, 16%, 7%, 1) 0,
      transparent 50%
    ),
    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
  position: relative;
  overflow-x: hidden;
  min-height: 100vh;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: #4f46e5;
  top: -100px;
  left: -100px;
}
.blob-2 {
  width: 300px;
  height: 300px;
  background: #ec4899;
  bottom: -50px;
  right: -50px;
}
.blob-3 {
  width: 250px;
  height: 250px;
  background: #06b6d4;
  top: 40%;
  left: 60%;
  opacity: 0.2;
}

.z-index-1 {
  position: relative;
  z-index: 1;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.btn-gradient {
  background: linear-gradient(to right, #6366f1, #a855f7, #ec4899);
  transition: opacity 0.3s ease, transform 0.2s;
}
.btn-gradient:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.text-gradient-link,
.text-gradient-icon {
  background: linear-gradient(to right, #6366f1, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.text-gradient-icon {
  color: #a855f7 !important;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}
.border-highlight {
  border: 1px solid rgba(168, 85, 247, 0.3);
}
.border-opacity-20 {
  opacity: 0.2;
}
</style>

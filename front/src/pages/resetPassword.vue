<template>
  <v-container fluid class="fill-height login-background">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-8" elevation="12" rounded="xl">
          <div class="text-center mb-6">
            <v-icon icon="mdi-key-variant" size="50" color="primary"></v-icon>
            <h2 class="text-h5 font-weight-bold mt-4">Nova Senha</h2>
            <p class="text-body-2 text-medium-emphasis">
              Crie uma nova senha segura.
            </p>
          </div>

          <v-form @submit.prevent="handleReset" v-model="valid">
            <v-text-field
              v-model="password"
              label="Nova Senha"
              type="password"
              variant="outlined"
              :rules="[rules.required, rules.min]"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword"
              label="Confirmar Senha"
              type="password"
              variant="outlined"
              :rules="[rules.required, rules.match]"
              class="mb-6"
            ></v-text-field>

            <v-btn
              block
              color="primary"
              size="large"
              type="submit"
              :loading="loading"
              :disabled="!valid"
            >
              Alterar Senha
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const valid = ref(false);
const snackbar = ref({ show: false, text: "", color: "" });

const rules = {
  required: (v) => !!v || "Obrigatório",
  min: (v) => v.length >= 6 || "Mínimo 6 caracteres",
  match: (v) => v === password.value || "As senhas não coincidem",
};

const handleReset = async () => {
  const token = route.query.token;
  if (!token) {
    snackbar.value = { show: true, text: "Link inválido.", color: "error" };
    return;
  }

  loading.value = true;
  try {
    await auth.resetPassword(token, password.value);
    snackbar.value = {
      show: true,
      text: "Senha alterada com sucesso!",
      color: "success",
    };

    setTimeout(() => router.push("/login"), 2000);
  } catch (e) {
    snackbar.value = {
      show: true,
      text: "Link expirado ou inválido.",
      color: "error",
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-background {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>

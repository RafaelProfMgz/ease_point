<template>
  <v-container fluid class="fill-height login-background">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-8" elevation="12" rounded="xl">
          <div class="text-center mb-6">
            <v-icon icon="mdi-lock-reset" size="50" color="primary"></v-icon>
            <h2 class="text-h5 font-weight-bold mt-4">Recuperar Senha</h2>
            <p class="text-body-2 text-medium-emphasis mt-2">
              Digite seu e-mail para receber o link de redefinição.
            </p>
          </div>

          <v-form @submit.prevent="handleForgot" v-model="valid">
            <v-text-field
              v-model="email"
              label="E-mail cadastrado"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="primary"
              :rules="[rules.required, rules.email]"
              class="mb-4"
            ></v-text-field>

            <v-btn
              block
              color="primary"
              size="large"
              type="submit"
              :loading="loading"
              :disabled="!valid"
              class="mb-4"
            >
              Enviar Link
            </v-btn>

            <v-btn block variant="text" to="/login" color="grey-darken-1">
              Voltar para o Login
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
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const email = ref("");
const loading = ref(false);
const valid = ref(false);
const snackbar = ref({ show: false, text: "", color: "" });

const rules = {
  required: (v) => !!v || "Obrigatório",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
};

const handleForgot = async () => {
  if (!valid.value) return;
  loading.value = true;
  try {
    await auth.forgotPassword(email.value);
    snackbar.value = {
      show: true,
      text: "E-mail enviado! Verifique sua caixa de entrada.",
      color: "success",
    };
    email.value = "";
  } catch (e) {
    snackbar.value = {
      show: true,
      text: "Erro ao enviar e-mail. Verifique os dados.",
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

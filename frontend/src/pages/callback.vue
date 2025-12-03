<template>
  <div class="d-flex justify-center align-center fill-height">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
    <div class="ml-4">Verificando credenciais...</div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useSnackbarStore } from "@/stores/snackbar";

const router = useRouter();
const authStore = useAuthStore();
const snackbarStore = useSnackbarStore();

onMounted(async () => {
  const hash = window.location.hash;

  if (hash && hash.includes("access_token")) {
    try {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken) {
        if (refreshToken)
          localStorage.setItem("ponto_refresh_token", refreshToken);
        authStore.setToken(accessToken);

        try {
          await authStore.fetchUser();

          snackbarStore.showSnackbar("Login realizado com sucesso!", "success");
          router.push("/dashboard");
        } catch (apiError) {
          if (apiError.response && apiError.response.status === 404) {
            snackbarStore.showSnackbar(
              "Finalize seu cadastro para continuar.",
              "info"
            );
            router.push("/complete-signup");
          } else {
            throw apiError;
          }
        }
      }
    } catch (error) {
      console.error("Erro no callback:", error);
      snackbarStore.showSnackbar("Falha na autenticação.", "error");
      router.push("/login");
    }
  } else {
    router.push("/login");
  }
});
</script>

<route lang="yaml">
meta:
  layout: blank
</route>

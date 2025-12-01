<template>
  <v-card class="pa-6 rounded-xl text-center" elevation="4" border>
    <!-- Relógio -->
    <div class="py-4">
      <div class="text-h2 font-weight-bold text-primary mb-1">
        {{ currentTime }}
      </div>
      <div
        class="text-subtitle-1 text-medium-emphasis font-weight-medium text-uppercase"
      >
        {{ currentDate }}
      </div>
    </div>

    <v-divider class="my-6"></v-divider>

    <!-- Botões de Ação Responsivos -->
    <v-row dense>
      <v-col cols="12" sm="4">
        <v-btn
          block
          size="x-large"
          color="success"
          variant="flat"
          prepend-icon="mdi-login"
          height="56"
          @click="handleRegister('ENTRADA')"
          :loading="loading === 'ENTRADA'"
          :disabled="loading !== ''"
        >
          Entrada
        </v-btn>
      </v-col>

      <v-col cols="12" sm="4">
        <v-btn
          block
          size="x-large"
          color="warning"
          variant="flat"
          prepend-icon="mdi-coffee"
          height="56"
          @click="handleRegister('INTERVALO')"
          :loading="loading === 'INTERVALO'"
          :disabled="loading !== ''"
        >
          Intervalo
        </v-btn>
      </v-col>

      <v-col cols="12" sm="4">
        <v-btn
          block
          size="x-large"
          color="error"
          variant="flat"
          prepend-icon="mdi-logout"
          height="56"
          @click="handleRegister('SAIDA')"
          :loading="loading === 'SAIDA'"
          :disabled="loading !== ''"
        >
          Saída
        </v-btn>
      </v-col>
    </v-row>

    <!-- Snackbar Local -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top"
      timeout="3000"
    >
      <div class="d-flex align-center">
        <v-icon :icon="snackbar.icon" start></v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { usePointStore } from "@/stores/points";

const pointStore = usePointStore();
const currentTime = ref("");
const currentDate = ref("");
const loading = ref("");

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
  icon: "mdi-check-circle",
});

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  currentDate.value = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

let timer = setInterval(updateTime, 1000);
onMounted(updateTime);
onUnmounted(() => clearInterval(timer));

const handleRegister = async (type) => {
  loading.value = type;
  try {
    await pointStore.registerPoint(type);
    showSnack(
      `Registro de ${type} realizado com sucesso!`,
      "success",
      "mdi-check-circle"
    );
  } catch (e) {
    showSnack(
      e.response?.data?.error || "Erro ao registrar ponto.",
      "error",
      "mdi-alert-circle"
    );
  } finally {
    loading.value = "";
  }
};

const showSnack = (text, color, icon) => {
  snackbar.value = { show: true, text, color, icon };
};
</script>

<template>
  <v-card class="pa-8 glass-card text-center" elevation="0" rounded="xl">
    <!-- Relógio Moderno -->
    <div class="py-6">
      <div class="clock-display mb-2">
        {{ currentTime }}
      </div>
      <div class="text-subtitle-1 text-grey-lighten-2 font-weight-medium text-uppercase letter-spacing-2">
        {{ currentDate }}
      </div>
    </div>

    <v-divider class="my-8 border-opacity-25" color="white"></v-divider>

    <v-row dense>
      <v-col cols="12" sm="4">
        <v-btn
          block
          size="x-large"
          color="success"
          class="action-btn glow-success"
          prepend-icon="mdi-login"
          height="64"
          rounded="lg"
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
          class="action-btn glow-warning text-white"
          prepend-icon="mdi-coffee"
          height="64"
          rounded="lg"
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
          class="action-btn glow-error"
          prepend-icon="mdi-logout"
          height="64"
          rounded="lg"
          @click="handleRegister('SAIDA')"
          :loading="loading === 'SAIDA'"
          :disabled="loading !== ''"
        >
          Saída
        </v-btn>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top"
      timeout="3000"
      rounded="lg"
      elevation="10"
    >
      <div class="d-flex align-center">
        <v-icon :icon="snackbar.icon" start></v-icon>
        <span class="font-weight-bold">{{ snackbar.text }}</span>
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
    showSnack(`Registro de ${type} realizado!`, "success", "mdi-check-circle");
  } catch (e) {
    showSnack(e.response?.data?.error || "Erro ao registrar.", "error", "mdi-alert-circle");
  } finally {
    loading.value = "";
  }
};

const showSnack = (text, color, icon) => {
  snackbar.value = { show: true, text, color, icon };
};
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.clock-display {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(to right, #fff, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.letter-spacing-2 {
  letter-spacing: 2px;
}

.action-btn {
  font-weight: 800;
  text-transform: none;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

.glow-success { box-shadow: 0 0 20px rgba(76, 175, 80, 0.2); }
.glow-warning { box-shadow: 0 0 20px rgba(255, 152, 0, 0.2); }
.glow-error { box-shadow: 0 0 20px rgba(244, 67, 54, 0.2); }

.action-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}
</style>
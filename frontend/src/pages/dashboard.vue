<route lang="yaml">
meta:
  requiresAuth: true
</route>

<template>
  <v-container class="fill-height pb-10" fluid>
    <v-row justify="center" align="center" class="flex-column">
      <div class="text-center mb-10">
        <div
          class="text-uppercase text-caption text-secondary font-weight-bold tracking-widest mb-2"
        >
          {{ currentDate }}
        </div>
        <h1 class="clock-text font-weight-black text-white">
          {{ currentTime }}
        </h1>
        <div
          class="d-inline-flex align-center px-3 py-1 rounded-pill bg-surface border-thin mt-2"
        >
          <div class="status-dot mr-2"></div>
          <span class="text-caption text-secondary">Sistema Operacional</span>
        </div>
      </div>

      <div class="hero-button-container mb-12">
        <v-btn
          width="200"
          height="200"
          rounded="circle"
          elevation="24"
          class="font-weight-bold text-h6"
          :class="{ 'pulse-button': !isLimitReached }"
          :color="isLimitReached ? 'success' : 'primary'"
          :loading="loading"
          :disabled="isLimitReached"
          @click="handleRegister"
        >
          <div class="d-flex flex-column align-center">
            <v-icon size="48" class="mb-2">
              {{ isLimitReached ? "mdi-check-all" : "mdi-fingerprint" }}
            </v-icon>

            <span>{{ nextActionLabel }}</span>

            <span v-if="isLimitReached" class="text-caption mt-1">
              4/4 Registros
            </span>
          </div>
        </v-btn>

        <div v-if="!isLimitReached" class="glow-effect"></div>
      </div>

      <v-card
        width="100%"
        max-width="500"
        color="surface"
        class="rounded-xl border-thin pa-4"
      >
        <div class="d-flex justify-space-between align-center mb-4 px-2">
          <span class="text-body-2 font-weight-bold text-white">Hoje</span>
          <v-btn
            icon="mdi-refresh"
            variant="text"
            size="small"
            color="secondary"
            @click="refreshPoints"
            :loading="loadingData"
          ></v-btn>
        </div>

        <div v-if="points.length > 0">
          <div
            v-for="(point, index) in points.slice().reverse()"
            :key="point.id || index"
            class="d-flex align-center justify-space-between py-3 px-2 mb-1 rounded-lg hover-bg"
            @click="openEditModal(point)"
          >
            <div class="d-flex align-center">
              <v-icon
                :color="isEntryType(point.type) ? 'success' : 'warning'"
                size="small"
                class="mr-3"
              >
                mdi-circle
              </v-icon>
              <span class="text-body-2 text-grey-lighten-2">
                {{ formatType(point.type) }}
              </span>
            </div>
            <span class="font-weight-bold text-white">
              {{ formatTimeOnly(point.created_at) }}
            </span>
            <v-btn
              v-if="isAdmin"
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              @click="openEditModal(point)"
            ></v-btn>
          </div>
        </div>
        <div v-else class="text-center py-6 text-secondary text-caption">
          Nenhum registro hoje. Toque no botão acima.
        </div>
      </v-card>
    </v-row>
    <EditPointDialog
      v-model="showEditModal"
      :point="selectedPoint"
      @saved="refreshPoints"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { usePointsStore } from "@/stores/points";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useSnackbarStore } from "@/stores/snackbar";
import EditPointDialog from "@/components/EditPointDialog.vue";

const pointsStore = usePointsStore();
const authStore = useAuthStore();
const snackbar = useSnackbarStore();

const { points } = storeToRefs(pointsStore);
const { isAdmin } = storeToRefs(authStore);

const loading = ref(false);
const loadingData = ref(false);
const now = ref(new Date());
let timer = null;

const showEditModal = ref(false);
const selectedPoint = ref(null);

const openEditModal = (point) => {
  selectedPoint.value = point;
  showEditModal.value = true;
};

const updateTime = () => {
  now.value = new Date();
};

const currentTime = computed(() => {
  return now.value.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

const currentDate = computed(() => {
  return now.value.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
});

const todayPoints = computed(() => {
  if (!points.value) return [];
  const todayStr = new Date().toDateString();

  return points.value.filter((p) => {
    const dateVal = p.created_at || p.createdAt;
    if (!dateVal) return false;
    return new Date(dateVal).toDateString() === todayStr;
  });
});

const isLimitReached = computed(() => {
  return todayPoints.value.length >= 4;
});

const nextType = computed(() => {
  const count = todayPoints.value.length;

  if (count >= 4) return null;

  switch (count) {
    case 0:
      return "ENTRADA";
    case 1:
      return "SAIDA_INTERVALO";
    case 2:
      return "VOLTA_INTERVALO";
    case 3:
      return "SAIDA";
    default:
      return "ENTRADA";
  }
});
const nextActionLabel = computed(() => {
  if (isLimitReached.value) return "CONCLUÍDO";

  const map = {
    ENTRADA: "ENTRAR",
    SAIDA_INTERVALO: "ALMOÇO",
    VOLTA_INTERVALO: "VOLTAR",
    SAIDA: "ENCERRAR",
  };
  return map[nextType.value] || "REGISTRAR";
});

const handleRegister = async () => {
  if (isLimitReached.value) {
    if (snackbar)
      snackbar.showSnackbar("Limite diário de 4 registros atingido.", "info");
    return;
  }

  loading.value = true;
  try {
    await pointsStore.registerPoint({
      type: nextType.value,
      description: `Registro via App - ${nextActionLabel.value}`,
    });
    await refreshPoints();
  } catch (error) {
    console.error("Falha ao registrar", error);
  } finally {
    loading.value = false;
  }
};

const refreshPoints = async () => {
  loadingData.value = true;
  try {
    await pointsStore.getPointsUser();
  } finally {
    loadingData.value = false;
  }
};

const formatTimeOnly = (dateString) => {
  if (!dateString) return "--:--";
  return new Date(dateString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isEntryType = (type) => {
  if (!type) return false;
  const t = type.toUpperCase();
  return t === "ENTRADA" || t === "VOLTA_INTERVALO" || t === "INTERVALO_FIM";
};

const formatType = (type) => {
  if (!type) return "";
  const t = type.toUpperCase();
  const map = {
    ENTRADA: "Entrada",
    SAIDA: "Saída",
    SAIDA_INTERVALO: "Início Intervalo",
    VOLTA_INTERVALO: "Fim Intervalo",
    INTERVALO_INICIO: "Início Intervalo",
    INTERVALO_FIM: "Fim Intervalo",
  };
  return map[t] || type;
};

onMounted(() => {
  timer = setInterval(updateTime, 1000);
  refreshPoints();
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.pulse-button {
  z-index: 2;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: radial-gradient(circle at 30% 30%, #38bdf8, #0284c7) !important;
  box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
  animation: pulse-primary 2s infinite;
}

.pulse-button:active {
  transform: scale(0.95);
}

.clock-text {
  font-size: 5rem;
  line-height: 1;
  letter-spacing: -2px;
  background: linear-gradient(to bottom right, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-button-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glow-effect {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: #38bdf8;
  filter: blur(60px);
  opacity: 0.2;
  z-index: 1;
  animation: breathe 4s ease-in-out infinite;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
}

.hover-bg:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.tracking-widest {
  letter-spacing: 0.2em;
}

@keyframes pulse-primary {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 20px rgba(56, 189, 248, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
  }
}

@keyframes breathe {
  0%,
  100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
}

@media (max-width: 600px) {
  .clock-text {
    font-size: 3.5rem;
  }
}
</style>

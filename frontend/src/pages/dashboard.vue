<route lang="yaml">
meta:
  requiresAuth: true
</route>

<template>
  <v-container class="fill-height pb-10" fluid>
    <v-row justify="center" align="center" class="flex-column">
      
      <div class="text-center mb-10">
        <div class="text-uppercase text-caption text-secondary font-weight-bold tracking-widest mb-2">
          {{ currentDate }}
        </div>
        <h1 class="clock-text font-weight-black text-white">
          {{ currentTime }}
        </h1>
        <div class="d-inline-flex align-center px-3 py-1 rounded-pill bg-surface border-thin mt-2">
          <div class="status-dot mr-2"></div>
          <span class="text-caption text-secondary">Sistema Operacional</span>
        </div>
      </div>

      <div class="hero-button-container mb-12">
        <v-btn
          width="200"
          height="200"
          rounded="circle"
          color="primary"
          elevation="24"
          class="pulse-button font-weight-bold text-h6"
          :loading="loading"
          @click="registerPoint"
        >
          <div class="d-flex flex-column align-center">
            <v-icon size="48" class="mb-2">mdi-fingerprint</v-icon>
            <span>REGISTRAR</span>
          </div>
        </v-btn>
        
        <div class="glow-effect"></div>
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
            @click="fetchPoints"
            :loading="loadingData"
          ></v-btn>
        </div>

        <div v-if="points.length > 0">
            <div 
              v-for="(point, index) in points" 
              :key="index"
              class="d-flex align-center justify-space-between py-3 px-2 mb-1 rounded-lg hover-bg"
            >
              <div class="d-flex align-center">
                <v-icon 
                  :color="point.type === 'ENTRY' ? 'success' : 'warning'" 
                  size="small" 
                  class="mr-3"
                >
                  mdi-circle
                </v-icon>
                <span class="text-body-2 text-grey-lighten-2">
                  {{ point.type === 'ENTRY' ? 'Entrada' : 'Saída' }}
                </span>
              </div>
              <span class="font-weight-bold text-white">
                {{ formatTimeOnly(point.createdAt) }}
              </span>
            </div>
        </div>
        <div v-else class="text-center py-6 text-secondary text-caption">
          Nenhum registro hoje. Toque no botão acima.
        </div>
      </v-card>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from '@/services/api';

const points = ref([]);
const loading = ref(false);
const loadingData = ref(false);
const now = ref(new Date());
let timer = null;

const currentTime = computed(() => {
  return now.value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
});

const currentDate = computed(() => {
  return now.value.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
});

const formatTimeOnly = (dateString) => {
  return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const updateTime = () => { now.value = new Date(); };

const fetchPoints = async () => {
  loadingData.value = true;
  try {
    const { data } = await api.get('/points');
    points.value = data.slice(0, 5); 
  } catch(e) { console.error(e); } 
  finally { loadingData.value = false; }
};

const registerPoint = async () => {
  loading.value = true;
  try {
    await api.post('/points');
    await fetchPoints();
  } catch(e) { alert('Erro ao registrar'); }
  finally { loading.value = false; }
};

onMounted(() => {
  timer = setInterval(updateTime, 1000);
  fetchPoints();
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
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

.tracking-widest { letter-spacing: 0.2em; }

@keyframes pulse-primary {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(56, 189, 248, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
}

@keyframes breathe {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.1); }
}

@media (max-width: 600px) {
  .clock-text { font-size: 3.5rem; }
}
</style>
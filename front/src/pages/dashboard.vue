<template>
  <div class="landing-bg min-h-screen position-relative">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    
    <DashboardHeader />

    <v-container class="mt-16 position-relative z-index-1" fluid>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8" xl="6">
          
          <div class="mb-8 d-flex align-center justify-space-between flex-wrap">
            <div>
              <h1 class="text-h4 font-weight-bold text-white mb-1">
                Painel de Controle
              </h1>
              <p class="text-body-1 text-grey-lighten-1">
                Gerencie sua jornada de trabalho
              </p>
            </div>

            <div class="d-none d-sm-flex align-center mt-4 mt-sm-0">
              <v-chip
                class="glass-chip font-weight-bold text-white"
                prepend-icon="mdi-check-all"
                size="large"
              >
                {{ pointStore.todaySummary.count || 0 }} registros hoje
              </v-chip>
            </div>
          </div>

          <v-row>
            <v-col cols="12">
              <ActionCard />
            </v-col>

            <v-col cols="12">
              <HistoryTable />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import DashboardHeader from "@/components/dashboard/Header.vue";
import ActionCard from "@/components/dashboard/ActionCard.vue";
import HistoryTable from "@/components/dashboard/HistoryTable.vue";
import { useAuthStore } from "@/stores/auth";
import { usePointStore } from "@/stores/points";
import { onMounted } from "vue";

const auth = useAuthStore();
const pointStore = usePointStore();

onMounted(() => {
  auth.checkSession();
  pointStore.fetchMyPoints();
});
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.landing-bg {
  background-color: #0f172a;
  background-image: radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
                    radial-gradient(at 50% 0%, hsla(225, 39%, 30%, 1) 0, transparent 50%),
                    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
  overflow-x: hidden;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}
.blob-1 { width: 500px; height: 500px; background: #4f46e5; top: -100px; left: -100px; }
.blob-2 { width: 400px; height: 400px; background: #ec4899; bottom: 0; right: -100px; }

.z-index-1 { position: relative; z-index: 1; }

.glass-chip {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}
</style>
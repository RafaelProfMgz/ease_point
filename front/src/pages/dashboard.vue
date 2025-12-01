<template>
  <div class="bg-grey-lighten-5 min-h-screen">
    <DashboardHeader />

    <v-container class="pt-8" fluid>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8" xl="6">
          <div class="mb-6 d-flex align-center justify-space-between flex-wrap">
            <div>
              <h1 class="text-h4 font-weight-bold text-primary">
                Painel de Controle
              </h1>
              <p class="text-body-1 text-medium-emphasis">
                Gerencie sua jornada de trabalho
              </p>
            </div>

            <div class="d-none d-sm-flex align-center mt-2 mt-sm-0">
              <v-chip
                color="primary"
                variant="outlined"
                class="font-weight-bold"
              >
                {{ pointStore.todaySummary.count }} registros hoje
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
</style>

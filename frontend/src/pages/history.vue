<route lang="yaml">
meta:
  requiresAuth: true
</route>

<template>
  <v-container class="fill-height align-start pa-6" fluid>
    <v-card class="w-100 rounded-xl elevation-2 border-thin" color="surface">
      <div class="d-flex flex-column">
        <v-toolbar color="transparent" class="px-4 pt-2">
          <v-toolbar-title class="text-h6 font-weight-bold text-primary">
            <v-icon start class="mr-2">mdi-history</v-icon>
            Histórico de Pontos
          </v-toolbar-title>

          <v-text-field
            v-if="tab === 'company'"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Buscar funcionário..."
            variant="outlined"
            density="compact"
            hide-details
            class="max-width-300 ml-auto"
            bg-color="surface"
          ></v-text-field>
        </v-toolbar>

        <v-tabs
          v-if="isAdmin"
          v-model="tab"
          color="primary"
          align-tabs="start"
          class="px-4 border-b"
        >
          <v-tab value="personal">
            <v-icon start>mdi-account</v-icon>
            Meus Registros
          </v-tab>
          <v-tab value="company">
            <v-icon start>mdi-domain</v-icon>
            Visão Geral
          </v-tab>
        </v-tabs>
      </div>

      <v-window v-model="tab" class="pa-4">
        <v-window-item value="personal">
          <v-data-table
            :headers="headersPersonal"
            :items="points"
            :loading="loading"
            class="elevation-0 bg-transparent"
            no-data-text="Nenhum registro encontrado."
            items-per-page-text="Linhas por página"
            :sort-by="[{ key: 'created_at', order: 'desc' }]"
          >
            <template v-slot:item.type="{ item }">
              <v-chip
                :color="getTypeColor(item.type)"
                size="small"
                variant="flat"
                class="font-weight-bold"
              >
                {{ formatType(item.type) }}
              </v-chip>
            </template>

            <template v-slot:item.created_at="{ item }">
              <div class="d-flex flex-column">
                <span class="font-weight-medium">{{
                  formatDate(item.created_at)
                }}</span>
                <span class="text-caption text-medium-emphasis">{{
                  formatTime(item.created_at)
                }}</span>
              </div>
            </template>
          </v-data-table>
        </v-window-item>

        <v-window-item value="company" v-if="isAdmin">
          <v-data-table
            :headers="headersCompany"
            :items="points"
            :loading="loading"
            :search="search"
            class="elevation-0 bg-transparent"
            no-data-text="Nenhum registro encontrado."
            items-per-page-text="Linhas por página"
            :sort-by="[{ key: 'created_at', order: 'desc' }]"
          >
            <template v-slot:item.user_name="{ item }">
              <div class="d-flex align-center">
                <v-avatar
                  color="primary"
                  variant="tonal"
                  size="32"
                  class="mr-2"
                >
                  <span class="text-caption font-weight-bold">
                    {{ getInitials(item.users?.name || "U") }}
                  </span>
                </v-avatar>
                <div class="d-flex flex-column">
                  <span class="font-weight-bold text-body-2">{{
                    item.users?.name || "Desconhecido"
                  }}</span>
                  <span class="text-caption text-grey">{{
                    item.users?.email
                  }}</span>
                </div>
              </div>
            </template>

            <template v-slot:item.type="{ item }">
              <v-chip
                :color="getTypeColor(item.type)"
                size="small"
                variant="outlined"
                class="font-weight-bold"
              >
                {{ formatType(item.type) }}
              </v-chip>
            </template>

            <template v-slot:item.created_at="{ item }">
              {{ formatDate(item.created_at) }} às
              {{ formatTime(item.created_at) }}
            </template>
          </v-data-table>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePointsStore } from "@/stores/points";
import { useAuthStore } from "@/stores/auth";

const pointsStore = usePointsStore();
const authStore = useAuthStore();
const { points, loading } = storeToRefs(pointsStore);
const { isAdmin, user } = storeToRefs(authStore);

const tab = ref("personal");
const search = ref("");

const headersPersonal = [
  { title: "Data / Hora", key: "created_at", align: "start", sortable: true },
  { title: "Tipo", key: "type", align: "center", sortable: false },
  { title: "Descrição", key: "description", align: "start", sortable: false },
];

const headersCompany = [
  { title: "Funcionário", key: "user_name", align: "start", sortable: true },
  { title: "Tipo", key: "type", align: "center" },
  { title: "Data / Hora", key: "created_at", align: "end" },
];

const fetchBasedOnTab = async () => {
  if (tab.value === "company" && isAdmin.value) {
    if (user.value?.company_id) {
      await pointsStore.getCompanyPoints(user.value.company_id);
    }
  } else {
    await pointsStore.getPoints();
  }
};

watch(tab, () => {
  search.value = "";
  fetchBasedOnTab();
});

onMounted(() => {
  fetchBasedOnTab();
});

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

const getTypeColor = (type) => {
  if (!type) return "grey";
  const t = type.toUpperCase();
  if (t === "ENTRADA" || t === "VOLTA_INTERVALO") return "success";
  if (t === "SAIDA_INTERVALO" || t === "SAIDA") return "warning";
  return "grey";
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR");
};

const formatTime = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}

:deep(.v-data-table) {
  background: transparent !important;
}

:deep(.v-theme--light) {
  --v-theme-surface: 255, 255, 255;
}
</style>

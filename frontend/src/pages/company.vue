<route lang="yaml">
meta:
  requiresAuth: true
</route>

<template>
  <v-container class="fill-height align-start pa-6" fluid>
    <v-row>
      <v-col cols="12" md="8">
        <v-card
          class="rounded-xl border-thin h-100"
          color="surface"
          :loading="loading"
        >
          <div class="company-header pa-6 d-flex align-end">
            <v-avatar
              color="primary"
              size="80"
              class="elevation-6 border-white"
              style="border: 4px solid rgba(255, 255, 255, 0.1)"
            >
              <v-icon size="40" color="white">mdi-domain</v-icon>
            </v-avatar>

            <div class="ml-4 mb-1">
              <h2 class="text-h5 font-weight-black text-white mb-0">
                {{ company.name || "Carregando..." }}
              </h2>
              <div class="d-flex align-center mt-1">
                <v-chip
                  :color="getPlanColor(company.plan)"
                  size="x-small"
                  variant="flat"
                  class="font-weight-bold text-uppercase mr-2"
                >
                  {{ company.plan || "Free" }}
                </v-chip>
                <span class="text-caption text-grey">
                  Cadastrada em {{ formatDate(company.created_at) }}
                </span>
              </div>
            </div>
          </div>

          <v-divider class="mx-6 border-opacity-25"></v-divider>

          <v-card-text class="pa-6">
            <h3 class="text-overline text-secondary font-weight-bold mb-4">
              Informações Corporativas
            </h3>

            <v-row>
              <v-col cols="12" sm="6">
                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-avatar
                      color="surface-light"
                      size="40"
                      class="rounded-lg"
                    >
                      <v-icon color="primary">mdi-card-account-details</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-bold"
                    >CNPJ</v-list-item-title
                  >
                  <v-list-item-subtitle class="text-high-emphasis">
                    {{ formatCNPJ(company.cnpj) || "Não informado" }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>

              <v-col cols="12" sm="6">
                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-avatar
                      color="surface-light"
                      size="40"
                      class="rounded-lg"
                    >
                      <v-icon color="primary">mdi-map-marker</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-bold"
                    >Localização</v-list-item-title
                  >
                  <v-list-item-subtitle class="text-high-emphasis">
                    {{ company.location || "Brasil (Padrão)" }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>

              <v-col cols="12" sm="6">
                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-avatar
                      color="surface-light"
                      size="40"
                      class="rounded-lg"
                    >
                      <v-icon color="primary">mdi-account-tie</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-bold"
                    >Responsável</v-list-item-title
                  >
                  <v-list-item-subtitle class="text-high-emphasis">
                    {{ user?.name || "Você" }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>

              <v-col cols="12" sm="6">
                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-avatar
                      color="surface-light"
                      size="40"
                      class="rounded-lg"
                    >
                      <v-icon :color="company.active ? 'success' : 'error'">
                        {{
                          company.active
                            ? "mdi-check-circle"
                            : "mdi-alert-circle"
                        }}
                      </v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-bold"
                    >Status do Contrato</v-list-item-title
                  >
                  <v-list-item-subtitle
                    :class="company.active ? 'text-success' : 'text-error'"
                  >
                    {{ company.active ? "Ativo" : "Suspenso" }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="pa-6 pt-0" v-if="isAdmin">
            <v-spacer></v-spacer>
            <v-btn
              variant="outlined"
              color="primary"
              prepend-icon="mdi-pencil"
              class="text-none"
            >
              Editar Dados
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="rounded-xl border-thin h-100 pa-4" color="surface">
          <div class="d-flex align-center justify-space-between mb-4">
            <span class="text-h6 font-weight-bold">Visão Geral</span>
            <v-btn
              icon="mdi-dots-vertical"
              variant="text"
              density="comfortable"
              color="grey"
            ></v-btn>
          </div>

          <v-sheet class="bg-surface-light rounded-lg pa-4 mb-3 border-thin">
            <div class="d-flex align-center mb-2">
              <v-icon color="info" class="mr-2">mdi-account-group</v-icon>
              <span class="text-body-2 font-weight-medium text-grey"
                >Funcionários</span
              >
            </div>
            <div class="text-h4 font-weight-black text-white">
              {{ employeeCount }}
            </div>
            <div class="text-caption text-success mt-1">
              <v-icon size="small" start>mdi-arrow-up</v-icon>
              Ativos na plataforma
            </div>
          </v-sheet>

          <v-sheet class="bg-surface-light rounded-lg pa-4 border-thin">
            <div class="d-flex align-center mb-2">
              <v-icon color="warning" class="mr-2">mdi-clock-outline</v-icon>
              <span class="text-body-2 font-weight-medium text-grey"
                >Fuso Horário</span
              >
            </div>
            <div class="text-body-1 font-weight-bold text-white">
              {{ company.settings?.timezone || "America/Sao_Paulo" }}
            </div>
            <div class="text-caption text-grey mt-1">Configuração padrão</div>
          </v-sheet>

          <div class="mt-6 text-center">
            <v-btn
              v-if="isAdmin"
              block
              color="secondary"
              variant="tonal"
              prepend-icon="mdi-account-plus"
              @click="$router.push('/users')"
            >
              Gerenciar Equipe
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import api from "@/services/api";

const authStore = useAuthStore();
const { user, isAdmin } = storeToRefs(authStore);

const loading = ref(false);
const company = ref({});
const employeeCount = ref(0);

const fetchCompanyData = async () => {
  if (!user.value?.company_id) return;

  loading.value = true;
  try {
    const { data } = await api.get(`/companies/${user.value.company_id}`);
    company.value = data;

    if (isAdmin.value) {
      const usersResponse = await api.get(
        `/users/company/${user.value.company_id}`
      );
      employeeCount.value = usersResponse.data.length;
    } else {
      employeeCount.value = 1;
    }
  } catch (error) {
    console.error("Erro ao carregar empresa:", error);
  } finally {
    loading.value = false;
  }
};

const getPlanColor = (plan) => {
  if (!plan) return "grey";
  const p = plan.toLowerCase();
  if (p === "ouro") return "#FFD700";
  if (p === "prata") return "#C0C0C0";
  if (p === "bronze") return "#CD7F32";
  return "primary";
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
};

const formatCNPJ = (cnpj) => {
  if (!cnpj) return "";
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

onMounted(() => {
  fetchCompanyData();
});
</script>

<style scoped>
.company-header {
  height: 140px;
  background: linear-gradient(
    to right,
    rgba(56, 189, 248, 0.1),
    rgba(0, 0, 0, 0)
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.bg-surface-light {
  background-color: rgba(255, 255, 255, 0.03) !important;
}

.v-card {
  backdrop-filter: blur(10px);
}
</style>

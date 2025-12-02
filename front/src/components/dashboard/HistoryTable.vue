<template>
  <v-card class="mt-6 glass-card" elevation="0" rounded="xl">
    <div class="d-flex align-center py-4 px-6 border-bottom-glass">
      <div class="d-flex align-center">
        <v-avatar color="rgba(99, 102, 241, 0.2)" size="40" class="mr-4 rounded-lg">
          <v-icon icon="mdi-history" color="indigo-lighten-1" size="24"></v-icon>
        </v-avatar>
        <span class="text-h6 font-weight-bold text-white">Histórico Recente</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        icon
        variant="text"
        size="small"
        color="grey-lighten-1"
        @click="pointStore.fetchMyPoints"
        :loading="pointStore.loading"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <v-data-table
      :items="pointStore.history"
      :headers="headers"
      :loading="pointStore.loading"
      items-per-page="5"
      no-data-text="Nenhum registro hoje"
      class="bg-transparent text-white mt-2"
      hover
    >
      <template v-slot:item.created_at="{ item }">
        <div class="d-flex flex-column py-2">
          <span class="font-weight-bold text-body-2 text-white">
            {{ new Date(item.created_at).toLocaleDateString("pt-BR") }}
          </span>
          <span class="text-caption text-grey-lighten-1">
            {{
              new Date(item.created_at).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </span>
        </div>
      </template>

      <template v-slot:item.type="{ item }">
        <v-chip
          :color="getTypeConfig(item.type).color"
          :prepend-icon="getTypeConfig(item.type).icon"
          size="small"
          label
          variant="tonal"
          class="font-weight-bold"
        >
          {{ item.type }}
        </v-chip>
      </template>

      <template v-slot:item.description="{ item }">
        <span class="text-grey-lighten-1">{{ item.description || '-' }}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          icon="mdi-trash-can-outline"
          variant="text"
          color="red-lighten-2"
          size="small"
          class="opacity-70"
          @click="confirmDelete(item.id)"
        ></v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { onMounted } from "vue";
import { usePointStore } from "@/stores/points";

const pointStore = usePointStore();

const headers = [
  { title: "Data / Hora", key: "created_at", align: "start", sortable: true },
  { title: "Tipo", key: "type", align: "start" },
  { title: "Observação", key: "description", align: "start" },
  { title: "", key: "actions", align: "end", sortable: false },
];

const getTypeConfig = (type) => {
  switch (type) {
    case "ENTRADA": return { color: "green-accent-3", icon: "mdi-login-variant" };
    case "SAIDA": return { color: "red-accent-2", icon: "mdi-logout-variant" };
    case "INTERVALO": return { color: "orange-accent-3", icon: "mdi-coffee-outline" };
    default: return { color: "grey", icon: "mdi-clock-outline" };
  }
};

const confirmDelete = async (id) => {
  if (confirm("Excluir este registro?")) {
    try {
      await pointStore.deletePoint(id);
    } catch (e) {
      alert("Erro ao excluir");
    }
  }
};

onMounted(() => {
  pointStore.fetchMyPoints();
});
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.border-bottom-glass {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.opacity-70 {
  opacity: 0.7;
}

:deep(.v-data-table) {
  background: transparent !important;
}
:deep(.v-data-table__tr:hover) {
  background: rgba(255,255,255,0.05) !important;
}
:deep(.v-data-table-footer) {
  background: transparent !important;
  color: white;
}
:deep(.v-table__wrapper) {
  color: white;
}
</style>
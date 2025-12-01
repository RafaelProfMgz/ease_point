<template>
  <v-card class="mt-6 rounded-xl" elevation="2" border>
    <v-card-title class="d-flex align-center py-4 px-6">
      <div class="d-flex align-center">
        <v-avatar color="primary" variant="tonal" size="32" class="mr-3">
          <v-icon icon="mdi-history" size="18"></v-icon>
        </v-avatar>
        <span class="text-h6 font-weight-bold">Histórico Recente</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        icon
        variant="text"
        size="small"
        color="grey-darken-1"
        @click="pointStore.fetchMyPoints"
        :loading="pointStore.loading"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      :items="pointStore.history"
      :headers="headers"
      :loading="pointStore.loading"
      items-per-page="5"
      no-data-text="Nenhum registro encontrado hoje"
      hover
    >
      <template v-slot:item.created_at="{ item }">
        <div class="d-flex flex-column py-2">
          <span class="font-weight-bold text-body-2">
            {{ new Date(item.created_at).toLocaleDateString("pt-BR") }}
          </span>
          <span class="text-caption text-grey">
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
          class="font-weight-bold"
        >
          {{ item.type }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          icon="mdi-delete-outline"
          variant="text"
          color="error"
          size="small"
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
  { title: "Descrição", key: "description", align: "start" },
  { title: "", key: "actions", align: "end", sortable: false },
];

const getTypeConfig = (type) => {
  switch (type) {
    case "ENTRADA":
      return { color: "green-darken-1", icon: "mdi-login" };
    case "SAIDA":
      return { color: "red-darken-1", icon: "mdi-logout" };
    case "INTERVALO":
      return { color: "orange-darken-2", icon: "mdi-coffee" };
    default:
      return { color: "grey", icon: "mdi-clock-outline" };
  }
};

const confirmDelete = async (id) => {
  if (confirm("Tem certeza que deseja excluir este registro?")) {
    try {
      await pointStore.deletePoint(id);
    } catch (e) {
      alert("Erro ao excluir");
    }
  }
};

onMounted(() => {
  // Garante que a lista esteja atualizada ao montar o componente
  pointStore.fetchMyPoints();
});
</script>

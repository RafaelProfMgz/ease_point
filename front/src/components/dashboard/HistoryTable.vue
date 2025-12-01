<template>
  <v-card class="mt-6 rounded-lg" elevation="2">
    <v-card-title class="d-flex align-center py-4 px-6">
      <v-icon icon="mdi-history" color="primary" class="mr-2"></v-icon>
      Histórico Recente
      <v-spacer></v-spacer>
      <v-btn icon="mdi-refresh" variant="text" size="small" @click="pointStore.fetchHistory" :loading="pointStore.loading"></v-btn>
    </v-card-title>

    <v-data-table
      :items="pointStore.history"
      :headers="headers"
      :loading="pointStore.loading"
      items-per-page="5"
      hover
    >
      <!-- Formatar Data -->
      <template v-slot:item.created_at="{ item }">
        <div class="font-weight-medium">
          {{ new Date(item.created_at).toLocaleDateString('pt-BR') }}
        </div>
        <div class="text-caption text-grey">
          {{ new Date(item.created_at).toLocaleTimeString('pt-BR') }}
        </div>
      </template>

      <!-- Formatar Chip de Tipo -->
      <template v-slot:item.type="{ item }">
        <v-chip :color="getColor(item.type)" size="small" label font-weight-bold>
          {{ item.type }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePointStore } from '@/stores/points'

const pointStore = usePointStore()

const headers = [
  { title: 'Data / Hora', key: 'created_at', align: 'start' },
  { title: 'Tipo', key: 'type', align: 'center' },
  { title: 'Descrição', key: 'description' },
]

const getColor = (type) => {
  switch (type) {
    case 'ENTRADA': return 'green'
    case 'SAIDA': return 'red'
    case 'INTERVALO': return 'orange'
    default: return 'grey'
  }
}

onMounted(() => {
  pointStore.fetchHistory()
})
</script>
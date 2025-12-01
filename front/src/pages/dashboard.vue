<template>
  <DashboardHeader />

  <v-container class="fill-height align-start bg-grey-lighten-5 pt-8" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        
        <div class="mb-6">
          <h1 class="text-h4 font-weight-bold text-grey-darken-3">Painel de Controle</h1>
          <p class="text-grey-darken-1">Gerencie sua jornada de trabalho</p>
        </div>

        <ActionCard />

        <HistoryTable />

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import DashboardHeader from '@/components/dashboard/Header.vue'
import ActionCard from '@/components/dashboard/ActionCard.vue'
import HistoryTable from '@/components/dashboard/HistoryTable.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const auth = useAuthStore()

onMounted(() => {
  auth.checkSession()
})
</script>
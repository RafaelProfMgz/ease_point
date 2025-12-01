<template>
  <v-app-bar color="white" elevation="1">
    <v-app-bar-title class="font-weight-bold text-primary">
      <v-icon icon="mdi-clock-check-outline" start></v-icon>
      EasyPoint
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <div class="mr-4 text-body-2 d-none d-sm-block">
      Olá, <strong>{{ auth.user?.name || 'Colaborador' }}</strong>
    </div>

    <v-btn icon color="grey-darken-1" @click="auth.logout" title="Sair">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>
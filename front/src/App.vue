<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>

    <v-snackbar
      v-model="snackbarStore.show"
      :color="snackbarStore.color"
      :timeout="snackbarStore.timeout"
      location="top right"
    >
      {{ snackbarStore.text }}
      
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbarStore.show = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSnackbarStore } from '@/stores/snackbar'

const auth = useAuthStore()
const snackbarStore = useSnackbarStore() 

onMounted(() => {
  auth.checkSession()
})
</script>
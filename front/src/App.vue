<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>

    <GlobalSnackbar />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import GlobalSnackbar from '@/components/GlobalSnackbar.vue'

const auth = useAuthStore()

onMounted(() => {
  auth.checkSession()
})
</script>
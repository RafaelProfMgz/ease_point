<template>
  <v-card class="text-center pa-6 rounded-lg" elevation="3">
    <div class="text-h2 font-weight-bold text-grey-darken-3 mb-2">
      {{ currentTime }}
    </div>
    <div class="text-subtitle-1 text-grey mb-6">
      {{ currentDate }}
    </div>

    <v-divider class="mb-6"></v-divider>

    <div class="d-flex justify-center flex-wrap gap-4">
      <v-btn
        size="x-large"
        color="green-darken-1"
        prepend-icon="mdi-login"
        @click="handleRegister('ENTRADA')"
        :loading="pointStore.loading"
        width="160"
        elevation="4"
      >
        Entrada
      </v-btn>

      <v-btn
        size="x-large"
        color="orange-darken-2"
        prepend-icon="mdi-coffee"
        @click="handleRegister('INTERVALO')"
        :loading="pointStore.loading"
        width="160"
        elevation="4"
      >
        Intervalo
      </v-btn>

      <v-btn
        size="x-large"
        color="red-darken-1"
        prepend-icon="mdi-logout"
        @click="handleRegister('SAIDA')"
        :loading="pointStore.loading"
        width="160"
        elevation="4"
      >
        Saída
      </v-btn>
    </div>

    <v-snackbar v-model="snackbar" :color="snackColor" location="top">
      {{ snackText }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePointStore } from '@/stores/points'

const pointStore = usePointStore()
const currentTime = ref('')
const currentDate = ref('')
const snackbar = ref(false)
const snackText = ref('')
const snackColor = ref('success')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('pt-BR')
  currentDate.value = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

let timer = setInterval(updateTime, 1000)
onUnmounted(() => clearInterval(timer))
onMounted(updateTime)

const handleRegister = async (type) => {
  try {
    await pointStore.registerPoint(type)
    snackText.value = `Registro de ${type} realizado!`
    snackColor.value = 'success'
    snackbar.value = true
  } catch (e) {
    snackText.value = 'Erro ao registrar ponto. Tente novamente.'
    snackColor.value = 'error'
    snackbar.value = true
  }
}
</script>

<style scoped>
.gap-4 { gap: 16px; }
</style>
<template>
  <v-snackbar
    v-model="store.show"
    :color="store.color"
    :timeout="store.timeout"
    location="top right"
    elevation="8"
    rounded="lg"
  >
    <div class="d-flex align-center">
      <v-icon :icon="icon" class="mr-2" size="small"></v-icon>
      <span class="font-weight-medium text-body-2">{{ store.text }}</span>
    </div>

    <template v-slot:actions>
      <v-btn
        variant="text"
        icon="mdi-close"
        size="small"
        @click="store.show = false"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue';
import { useSnackbarStore } from '@/stores/snackbar';

const store = useSnackbarStore();

const icon = computed(() => {
  switch (store.color) {
    case 'error': return 'mdi-alert-circle';
    case 'warning': return 'mdi-alert';
    case 'info': return 'mdi-information';
    default: return 'mdi-check-circle';
  }
});
</script>
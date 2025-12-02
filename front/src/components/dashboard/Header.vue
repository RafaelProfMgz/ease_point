<template>
  <v-app-bar color="transparent" elevation="0" density="comfortable" class="border-bottom-glass">
    <v-container class="d-flex align-center py-0 fill-height" fluid>
      <!-- Logo com Gradiente -->
      <v-app-bar-title class="font-weight-bold d-flex align-center" style="cursor: pointer">
        <div class="d-flex align-center">
          <v-icon icon="mdi-clock-fast" class="mr-2 text-gradient-icon" size="28"></v-icon>
          <span class="text-white text-h6 font-weight-bold">EasyPoint</span>
        </div>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <div class="text-right mr-3 d-none d-sm-block">
          <div class="text-subtitle-2 font-weight-bold text-white">{{ userName }}</div>
          <div class="text-caption text-grey-lighten-1">{{ companyName }}</div>
        </div>

        <v-menu min-width="200px" rounded location="bottom end" offset="10">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="ml-1">
              <v-avatar color="transparent" class="border-gradient">
                <span class="text-h6 font-weight-bold text-white">{{ userInitials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          
          <v-card theme="dark" class="glass-menu" elevation="10">
            <v-list bg-color="transparent">
              <v-list-item
                prepend-icon="mdi-account-circle-outline"
                title="Meu Perfil"
                value="profile"
                class="text-white"
              ></v-list-item>
              <v-divider class="my-1 border-opacity-25"></v-divider>
              <v-list-item
                prepend-icon="mdi-logout"
                title="Sair"
                value="logout"
                @click="auth.logout"
                class="text-red-lighten-1"
              ></v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const userName = computed(() => auth.user?.name || "Colaborador");
const companyName = computed(() => auth.user?.company_name || "Empresa");

const userInitials = computed(() => {
  const name = auth.user?.name || "U";
  return name.substring(0, 2).toUpperCase();
});
</script>

<style scoped>
.border-bottom-glass {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.text-gradient-icon {
  background: linear-gradient(to right, #6366f1, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: #a855f7;
}

.border-gradient {
  border: 2px solid;
  border-image-slice: 1;
  border-width: 2px;
  border-image-source: linear-gradient(to right, #6366f1, #ec4899);
}

.glass-menu {
  background: rgba(30, 41, 59, 0.95) !important;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
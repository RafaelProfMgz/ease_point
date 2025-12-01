<template>
  <v-app-bar color="white" elevation="1" density="comfortable">
    <v-container class="d-flex align-center py-0 fill-height" fluid>
      <v-app-bar-title
        class="font-weight-bold text-primary d-flex align-center"
      >
        <v-icon icon="mdi-clock-check-outline" start color="primary"></v-icon>
        EasyPoint
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <div class="text-right mr-3 d-none d-sm-block">
          <div class="text-subtitle-2 font-weight-bold">{{ userName }}</div>
          <div class="text-caption text-medium-emphasis">{{ companyName }}</div>
        </div>

        <v-menu min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="primary" variant="tonal">
                <span class="text-h6 font-weight-bold">{{ userInitials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item
              prepend-icon="mdi-account"
              title="Meu Perfil"
              value="profile"
            ></v-list-item>
            <v-divider></v-divider>
            <v-list-item
              prepend-icon="mdi-logout"
              title="Sair"
              value="logout"
              @click="auth.logout"
              color="error"
            ></v-list-item>
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

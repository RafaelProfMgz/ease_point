<template>
  <v-app class="bg-background">
    <v-app-bar app flat color="transparent" class="px-4 mt-2">
      <div
        class="d-flex align-center cursor-pointer"
        @click="$router.push('/')"
      >
        <v-icon
          color="primary"
          icon="mdi-clock-fast"
          size="small"
          class="mr-2"
        ></v-icon>
        <span class="font-weight-bold text-white">EasePoint</span>
      </div>

      <v-spacer></v-spacer>

      <div
        class="d-none d-md-flex align-center gap-2 mr-4 bg-surface rounded-pill px-4 py-1 border-thin"
      >
        <v-btn
          variant="text"
          to="/dashboard"
          size="small"
          :active="false"
          color="white"
        >
          Ponto
        </v-btn>
        <v-btn variant="text" to="/history" size="small" color="secondary"
          >Histórico</v-btn
        >
        <template v-if="authStore.isAdmin">
          <v-divider vertical class="mx-2 my-2"></v-divider>
          <v-btn variant="text" to="/users" size="small" color="secondary"
            >Colaboradores</v-btn
          >
          <v-btn variant="text" to="/company" size="small" color="secondary"
            >Empresa</v-btn
          >
        </template>
      </div>

      <v-menu location="bottom end" transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-avatar
            color="surface"
            v-bind="props"
            class="cursor-pointer border-thin"
            size="40"
          >
            <span class="text-primary font-weight-bold">{{
              userInitials
            }}</span>
          </v-avatar>
        </template>
        <v-list
          bg-color="surface"
          width="200"
          rounded="lg"
          class="border-thin mt-2"
        >
          <v-list-item>
            <v-list-item-title class="font-weight-bold">{{
              authStore.userName
            }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ authStore.isAdmin ? "Administrador" : "Colaborador" }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item
            link
            @click="handleLogout"
            prepend-icon="mdi-logout"
            title="Sair"
            color="error"
          ></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const userInitials = computed(() => {
  const name = authStore.userName || "U";
  return name.charAt(0).toUpperCase();
});

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.border-thin {
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
</style>
